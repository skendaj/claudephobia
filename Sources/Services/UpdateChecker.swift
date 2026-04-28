import Foundation

struct UpdateResult {
    let version: String
    let releaseURL: String
}

actor UpdateChecker {
    private static let checkIntervalSeconds: TimeInterval = 6 * 3600

    private struct GitHubRelease: Decodable {
        let tag_name: String
        let html_url: String
    }

    func check() async -> UpdateResult? {
        guard !isRecentlyChecked() else { return nil }

        guard let url = URL(string: "https://api.github.com/repos/skendaj/Claudephobia/releases/latest") else { return nil }

        var request = URLRequest(url: url)
        request.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 10

        do {
            let (data, response) = try await URLSession.shared.data(for: request)
            guard (response as? HTTPURLResponse)?.statusCode == 200 else { return nil }
            let release = try JSONDecoder().decode(GitHubRelease.self, from: data)
            recordCheckDate()
            let latestVersion = release.tag_name.trimmingCharacters(in: .init(charactersIn: "v"))
            guard isNewer(latestVersion, than: currentVersion()) else { return nil }
            return UpdateResult(version: latestVersion, releaseURL: release.html_url)
        } catch {
            return nil
        }
    }

    private func isRecentlyChecked() -> Bool {
        let lastCheck = UserDefaults.standard.double(forKey: "clawdephobia.last_update_check_date")
        guard lastCheck > 0 else { return false }
        return Date().timeIntervalSince1970 - lastCheck < Self.checkIntervalSeconds
    }

    private func recordCheckDate() {
        UserDefaults.standard.set(Date().timeIntervalSince1970, forKey: "clawdephobia.last_update_check_date")
    }

    private func currentVersion() -> String {
        (Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String) ?? "0.0.0"
    }

    private func isNewer(_ remote: String, than local: String) -> Bool {
        let parse: (String) -> [Int] = { v in v.split(separator: ".").compactMap { Int($0) } }
        let r = parse(remote)
        let l = parse(local)
        let count = max(r.count, l.count)
        for i in 0..<count {
            let rv = i < r.count ? r[i] : 0
            let lv = i < l.count ? l[i] : 0
            if rv != lv { return rv > lv }
        }
        return false
    }
}
