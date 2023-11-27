// filename: metro.config.js
const { getDefaultConfig } = require('metro-config')
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues()

exports.resolver = {
  ...defaultResolver,
  sourceExts: [...defaultResolver.sourceExts, 'cjs'],
}

// // filename: babel.config.js
// module.exports = function (api) {
//     api.cache(true)
//     return {
//       presets: ['babel-preset-expo'],
//       plugins: [
//         '@babel/plugin-syntax-import-assertions',
//         [
//           'babel-plugin-rewrite-require',
//           {
//             aliases: {
//               crypto: 'crypto-browserify',
//               stream: 'stream-browserify',
//             },
//           },
//         ],
//       ],
//     }
//   }