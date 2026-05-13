import Foundation

/// A Claude account configured in Clawdephobia. Identified by Anthropic org UUID
/// (or the constant `Account.demoId` for the synthetic demo account).
struct Account: Codable, Identifiable, Equatable {
    let id: String
    var label: String
    var detectedName: String?
    let addedAt: Date

    static let demoId = "demo"
    var isDemo: Bool { id == Account.demoId }
}

/// Lightweight cached usage snapshot for accounts that are not currently active,
/// used by the popover switcher to render compact "82% / 41%" badges.
struct AccountPeek: Equatable {
    let sessionPercent: Double
    let weeklyPercent: Double
    let updatedAt: Date
    let lastError: String?
}
