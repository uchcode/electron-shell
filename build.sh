#!/bin/sh
electron-packager sources "Electron Shell" --platform=darwin -arch=x64 --electronVersion=1.8.1 --app-bundle-id=io.github.uchcode.electron-shell --extend-info=resources/info.plist --extra-resource=resources/ElectronHTML.icns
