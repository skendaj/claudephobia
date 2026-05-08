#!/bin/bash
cd "$(dirname "$0")"
xcodebuild -project Clawdephobia.xcodeproj -scheme Clawdephobia -configuration Debug -derivedDataPath .build -quiet && \
  open -W .build/Build/Products/Debug/Clawdephobia.app
