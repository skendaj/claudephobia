// swift-tools-version:5.9
import PackageDescription

let package = Package(
    name: "Clawdephobia",
    platforms: [.macOS(.v13)],
    targets: [
        .executableTarget(
            name: "Clawdephobia",
            path: "Sources",
            resources: [
                .copy("Resources/icon.png")
            ]
        )
    ]
)
