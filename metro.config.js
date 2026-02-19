const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// ============================================
// PERFORMANCE OPTIMIZATIONS FOR FASTER LOADING
// ============================================

// 1. Configure cache directory (Metro uses built-in caching)
config.cacheVersion = "1.0";

// 2. Increase max workers for better CPU utilization
config.maxWorkers = 4; // Adjust based on your CPU cores

// 3. Optimize transformer for faster builds
config.transformer = {
  ...config.transformer,
  // Enable inline requires for better performance
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true, // Significantly improves startup time
    },
  }),
};

// 4. Optimize resolver
config.resolver = {
  ...config.resolver,
  // Optimize node modules resolution
  nodeModulesPaths: [path.resolve(__dirname, "node_modules")],
};

// 5. Optimize watcher for faster file change detection
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
