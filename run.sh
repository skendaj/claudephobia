#!/bin/bash
cd "$(dirname "$0")"
swift build && .build/debug/Clawdephobia
