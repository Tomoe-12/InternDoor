// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize @effect packages on server to prevent worker thread issues
      config.externals = config.externals || [];
      
      // Convert to function-based externals if needed
      const externals = Array.isArray(config.externals) ? [...config.externals] : [config.externals].filter(Boolean);
      
      config.externals = [
        ...externals,
        ({ request }, callback) => {
          if (request && (
            request.startsWith('@effect/') ||
            request.includes('worker.js')
          )) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];

      // Add resolve fallback for worker
      config.resolve = config.resolve || {};
      config.resolve.fallback = config.resolve.fallback || {};
      config.resolve.fallback['worker_threads'] = false;
      config.resolve.fallback['./lib/worker.js'] = false;
    }

    // Suppress warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@effect/ },
      { module: /worker\.js/ },
      /worker thread exited/,
      /Cannot find module/,
    ];

    return config;
  },
};

export default nextConfig;
