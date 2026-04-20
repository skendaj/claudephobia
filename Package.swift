// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "Clawdphobia",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(
            name: "Clawdphobia",
            path: "Sources",
            resources: [
                .copy("Resources/icon.png")
            ]
        )
    ]
)
