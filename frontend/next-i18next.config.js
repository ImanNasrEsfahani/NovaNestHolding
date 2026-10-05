const { i18n } = require('./package.json');
const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin');

module.exports = {
  i18n,
  defaultNS: 'common',
  defaultLanguage: 'en',
  locales: ['en', 'fa'],
  otherLanguages: ['fa'],
  localePath: './public/locales',
  webpack: (config, { isServer }) => {
    if (!isServer) { 
      config.plugins.push(
        new UnusedFilesWebpackPlugin({
          patterns: ['public/images/**/*.*'],
          globOptions: {
            ignore: ['node_modules/**']
          },
        })
      );
    }
    return config;
  }
};