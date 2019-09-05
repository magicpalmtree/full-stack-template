// Cloudinary like functionality
const withOptimizedImages = require('next-optimized-images')

// Service Worker for Progressive Web App (PWA) standards
const withOffline = require('next-offline')

// Bundle Analyzer
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer")

// .MDX support
const images = require('remark-images')
const emoji = require('remark-emoji')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    mdPlugins: [images, emoji]
  }
})

// .CSS support
const withCss = require('@zeit/next-css')

// .LESS support
/* eslint-disable */
const withLess = require('@zeit/next-less')
const lessToJS = require('less-vars-to-js')
const fs = require('fs')
const path = require('path')

// Where your antd-custom.less file lives
const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8'))

module.exports = withBundleAnalyzer(withOffline(withOptimizedImages(withMDX(withCss(withLess({
  // Now by ZEIT deployment target
  target: 'serverless',
  // Service Worker for Progressive Web App (PWA) standards
  transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
  // Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
  // turn on the SW in dev mode so that we can actually test it
  generateInDevMode: true,
  workboxOpts: {
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'https-calls',
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  // Webpack Bundle Analyzer
  analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  },
  // Markdown in JSX filetype support
  pageExtensions: ['mdx', 'md', 'jsx', 'js'],
  // Locally scored CSS modules
  // cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  // custom webpack config for Ant Design Less
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables, // make your antd custom effective
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }
    return config
  },
}))))))