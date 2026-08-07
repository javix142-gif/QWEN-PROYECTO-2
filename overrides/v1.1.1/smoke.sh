#!/usr/bin/env bash
set -euo pipefail

APK="$GITHUB_WORKSPACE/albionapp/build/outputs/apk/debug/albionapp-debug.apk"
PACKAGE="cl.javiersanmartin.albionmarketrelli"
COMPONENT="$PACKAGE/cl.javiersanmartin.albionmarketamerica.MainActivity"

adb install -r "$APK"
adb logcat -c
adb shell am start -W -n "$COMPONENT" | tee Albion_Marketrelli-v1.1.1-startup.txt
sleep 8
PID="$(adb shell pidof "$PACKAGE" | tr -d '\r')"
test -n "$PID"
adb logcat -d > Albion_Marketrelli-v1.1.1-logcat.txt
if grep -E "FATAL EXCEPTION: main|Process: ${PACKAGE}" Albion_Marketrelli-v1.1.1-logcat.txt; then
  exit 1
fi
