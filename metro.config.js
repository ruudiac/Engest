const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

// Let the bundler load .wasm files (needed by expo-sqlite's web version)
config.resolver.assetExts.push("wasm");

module.exports = withNativeWind(config, { input: './app/globals.css' })