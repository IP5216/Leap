const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Needed for Firebase modular SDK in Expo
config.resolver.sourceExts.push('cjs');

module.exports = config;