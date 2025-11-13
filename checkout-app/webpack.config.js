const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const deps = require('./package.json').dependencies;

const sharedConfig = {
  singleton: true,
  eager: true,
};

module.exports = (env, argv) => ({
  entry: './src/bootstrap.tsx',
  mode: argv.mode || 'development',
  devtool: argv.mode === 'production' ? 'source-map' : 'eval-source-map',
  devServer: {
    port: 3003,
    hot: true,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
    new ModuleFederationPlugin({
      name: 'checkout_app',
      filename: 'remoteEntry.js',
      exposes: {
        './Checkout': './src/Checkout',
      },
      remotes: {
        shopping_dashboard: 'shopping_dashboard@http://localhost:3000/remoteEntry.js',
      },
      shared: {
        react: { ...sharedConfig, requiredVersion: deps.react },
        'react-dom': { ...sharedConfig, requiredVersion: deps['react-dom'] },
        'react-router-dom': { ...sharedConfig, requiredVersion: deps['react-router-dom'] },
        '@reduxjs/toolkit': { ...sharedConfig, requiredVersion: deps['@reduxjs/toolkit'] },
        'react-redux': { ...sharedConfig, requiredVersion: deps['react-redux'] },
      },
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: 'http://localhost:3003/',
  },
});

