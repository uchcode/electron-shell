#!/bin/sh
electron-packager sources "Electron Shell" --platform=darwin -arch=x64 --electronVersion=1.7.6 --app-bundle-id=io.github.uchcode.electron-shell --extend-info=resources/info.plist --extra-resource=resources/ElectronHTML.icns
