import AppKit
import Foundation
import UserNotifications

/// Sends native macOS notifications when usage crosses warning or critical thresholds,
/// and optionally when limits reset. Optionally mirrors notifications to phone via ntfy.sh.
final class NotificationManager: NSObject, UNUserNotificationCenterDelegate {
    private var sentKeys = Set<String>()

    /// Push notification service for phone delivery via ntfy.sh
    let pushService = PushNotificationService()

    /// Whether to also send push notifications to phone
    var pushEnabled: Bool = false

    /// The ntfy topic the user subscribed to on their phone
    var pushTopic: String = ""

    /// The ntfy server URL (default: https://ntfy.sh, or self-hosted)
    var pushServerURL: String = "https://ntfy.sh"

    /// Tracks previous percent values to detect resets (usage dropping significantly)
    private var previousPercents: [String: Double] = [:]

    /// Whether we're running inside a proper .app bundle (UNUserNotificationCenter requires one)
    private let hasBundle = Bundle.main.bundleIdentifier != nil

    func requestPermission() {
        guard hasBundle else { return }
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { _, _ in }
    }

    /// Check usage and fire notifications if thresholds are crossed.
    func checkAndNotify(
        label: String,
        percentUsed: Double,
        warningThreshold: Double,
        criticalThreshold: Double,
        notifyOnReset: Bool
    ) {
        let pct = Int(percentUsed * 100)
        let warnKey = "\(label)-warning"
        let critKey = "\(label)-critical"
        let resetKey = "\(label)-reset"

        // Threshold notifications
        if percentUsed >= criticalThreshold && !sentKeys.contains(critKey) {
            sentKeys.insert(critKey)
            send(
                title: "Clawdephobia \u{2014} Critical",
                body: "\(label) at \(pct)%. You're about to hit your limit.",
                priority: 5
            )
        } else if percentUsed >= warningThreshold && !sentKeys.contains(warnKey) {
            sentKeys.insert(warnKey)
            send(
                title: "Clawdephobia \u{2014} Warning",
                body: "\(label) at \(pct)%. Consider slowing down."
            )
        }

        // Reset detection: usage dropped from >=20% to <5% (limit restored)
        if notifyOnReset, let prev = previousPercents[label] {
            if prev >= 0.20 && percentUsed < 0.05 && !sentKeys.contains(resetKey) {
                sentKeys.insert(resetKey)
                send(
                    title: "Clawdephobia \u{2014} Restored",
                    body: "\(label) has reset. You're good to go."
                )
            }
        }

        // Clear flags when usage drops below warning
        if percentUsed < warningThreshold {
            sentKeys.remove(warnKey)
            sentKeys.remove(critKey)
        }

        // Clear reset flag once usage climbs back up (so it can fire again next cycle)
        if percentUsed >= 0.05 {
            sentKeys.remove(resetKey)
        }

        previousPercents[label] = percentUsed
    }

    func sendTest() {
        guard hasBundle else {
            // Bare binary fallback
            sendLocal(title: "Clawdephobia \u{2014} Test", body: "Notifications are working.")
            return
        }
        UNUserNotificationCenter.current().getNotificationSettings { [weak self] settings in
            guard let self else { return }
            switch settings.authorizationStatus {
            case .authorized, .provisional, .ephemeral:
                DispatchQueue.main.async {
                    self.sendLocal(
                        title: "Clawdephobia \u{2014} Test",
                        body: "Notifications are working."
                    )
                }
            case .notDetermined:
                UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) { granted, _ in
                    guard granted else { return }
                    DispatchQueue.main.async {
                        self.sendLocal(
                            title: "Clawdephobia \u{2014} Test",
                            body: "Notifications are working."
                        )
                    }
                }
            case .denied:
                // Notifications are blocked in System Settings — open the pane so user can enable
                DispatchQueue.main.async {
                    NSWorkspace.shared.open(
                        URL(string: "x-apple.systempreferences:com.apple.preference.notifications")!
                    )
                }
            @unknown default:
                break
            }
        }
    }

    func sendTestPush() {
        pushService.sendTest(topic: pushTopic, serverURL: pushServerURL)
    }

    func sendServiceDown() {
        guard !sentKeys.contains("service-down") else { return }
        sentKeys.insert("service-down")
        send(
            title: "Clawdephobia \u{2014} Service Down",
            body: "Clawd appears to be unreachable. Usage data may be stale."
        )
    }

    func clearServiceDown() {
        sentKeys.remove("service-down")
    }

    func reset() {
        sentKeys.removeAll()
        previousPercents.removeAll()
    }

    // MARK: - Private

    private func send(title: String, body: String, priority: Int = 3) {
        sendLocal(title: title, body: body)

        // Mirror to phone via ntfy.sh
        if pushEnabled {
            pushService.send(
                title: title,
                body: body,
                topic: pushTopic,
                serverURL: pushServerURL,
                priority: priority
            )
        }
    }

    func sendLocal(title: String, body: String) {
        if hasBundle {
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.sound = .default

            let request = UNNotificationRequest(
                identifier: UUID().uuidString,
                content: content,
                trigger: nil
            )
            UNUserNotificationCenter.current().add(request) { error in
                if let error = error {
                    // UNUserNotificationCenter failed — fall back to osascript
                    print("[NotificationManager] UNUserNotificationCenter error: \(error). Falling back to osascript.")
                    let escapedTitle = title.replacingOccurrences(of: "\"", with: "\\\"")
                    let escapedBody = body.replacingOccurrences(of: "\"", with: "\\\"")
                    let script = "display notification \"\(escapedBody)\" with title \"\(escapedTitle)\""
                    let process = Process()
                    process.executableURL = URL(fileURLWithPath: "/usr/bin/osascript")
                    process.arguments = ["-e", script]
                    try? process.run()
                }
            }
        } else {
            // Fallback: use osascript for bare binary / debug builds
            let escapedTitle = title.replacingOccurrences(of: "\"" , with: "\\\"")
            let escapedBody = body.replacingOccurrences(of: "\"" , with: "\\\"")
            let script = "display notification \"\(escapedBody)\" with title \"\(escapedTitle)\""
            let process = Process()
            process.executableURL = URL(fileURLWithPath: "/usr/bin/osascript")
            process.arguments = ["-e", script]
            try? process.run()
        }
    }

    // MARK: - UNUserNotificationCenterDelegate

    /// Allow banners + sound even when the app is the frontmost app (e.g. Settings window open).
    func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound])
    }
}
