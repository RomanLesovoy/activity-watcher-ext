const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.ts',
    limits: './src/limits.ts',
    statistics: './src/statistics.ts',
    chromeHooks: './src/chromeHooks.ts',
    limitsContent: './src/limitsContent.ts',
    statisticsContent: './src/statisticsContent.ts',
    helpers: './src/helpers.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/popup.html", to: "popup.html" },
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/_locales", to: "_locales" },
        { from: "src/styles.css", to: "styles.css" },
        { from: "src/images", to: "images" },
      ],
    }),
  ],
  optimization: {
    minimize: false,
  },
  devtool: false,
};
