// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: './app/globals.css' });

















// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Enable SVG support
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter(ext => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

// Firebase fix: Force ESM resolution for @firebase/* packages
config.resolver.resolveRequest = (context, moduleImport, platform) => {
  if (moduleImport.startsWith('@firebase')) {
    return context.resolveRequest(
      { ...context, isESMImport: true },
      moduleImport,
      platform
    );
  }
  return context.resolveRequest(context, moduleImport, platform);
};

// Re-apply NativeWind setup for Tailwind CSS support
module.exports = withNativeWind(config, { input: './app/globals.css' });
