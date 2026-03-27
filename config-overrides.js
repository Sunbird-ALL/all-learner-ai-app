// Webpack configuration override for Create React App
// This allows us to import TypeScript files from the library directory
const { override } = require('customize-cra');
const path = require('path');

module.exports = override(
  (config) => {
    // Ensure TypeScript files are resolved
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }
    // Add .ts and .tsx if not already present (before .js for priority)
    const extensions = config.resolve.extensions;
    if (!extensions.includes('.ts')) {
      extensions.unshift('.ts');
    }
    if (!extensions.includes('.tsx')) {
      extensions.unshift('.tsx');
    }

    // Exclude src/lib/axl-explorations from fork-ts-checker type checking.
    // It is a vendored library with its own missing peer deps — Babel still
    // compiles its files correctly; only the type-checker needs to skip it.
    const ForkTsCheckerPlugin = config.plugins.find(
      (p) => p.constructor && p.constructor.name === 'ForkTsCheckerWebpackPlugin'
    );
    if (ForkTsCheckerPlugin && ForkTsCheckerPlugin.options) {
      const opts = ForkTsCheckerPlugin.options;
      // CRA v5 uses the `typescript` key with a `configFile` + `diagnosticOptions`
      if (opts.typescript) {
        opts.typescript.diagnosticOptions = opts.typescript.diagnosticOptions || {};
        opts.typescript.diagnosticOptions.semantic = {
          ...(opts.typescript.diagnosticOptions.semantic || {}),
          exclude: [
            ...(opts.typescript.diagnosticOptions.semantic?.exclude || []),
            path.resolve(__dirname, 'src/lib/axl-explorations/**/*'),
          ],
        };
      }
    }

    return config;
  }
);

