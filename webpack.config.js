const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { isDev, paths } = require('./utils');

// the style loaders for css/scss
function getStyleLoaders(cssLoaderOptions = {}) {
  const sourceMap = !!isDev;
  const reloadAll = true;

  return [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: !!isDev,
        reloadAll
      }
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap,
        importLoaders: 2,
        ...cssLoaderOptions
      }
    },
    {
      loader: 'postcss-loader',
      options: { sourceMap }
    },
    {
      loader: 'sass-loader',
      options: { sourceMap }
    }
  ];
}

// file loaders for both images and fonts
function getFileLoaders(options) {
  return [
    {
      loader: 'url-loader',
      options: {
        fallback: 'file-loader',
        publicPath,
        limit: 10240,
        ...options
      }
    }
  ];
}

function getWebpackConfig() {
  const config = {
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'cheap-module-inline-source-map' : 'source-map',
    context: paths.client,
    entry: './App.js',
    resolve: {
      extensions: ['.jsx', '.js', '.json', '.css']
    },
    output: {
      path: paths.public,
      publicPath: process.env.PUBLIC_PATH || '/',
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      chunkFilename: isDev
        ? '[name].chunk.js'
        : '[name].[contenthash:8].chunk.js'
    },
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserJSPlugin(),
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            parser: require('postcss-safe-parser')
          }
        })
      ],
      splitChunks: {
        chunks: 'all'
      }
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: !!isDev,
              configFile: true
            }
          }
        },
        {
          test: /\.module\.(css|scss|sass)$/,
          use: getStyleLoaders({
            modules: {
              mode: 'local',
              exportGlobals: true,
              localIdentName: isDev
                ? '[path][name]__[local]--[hash:base64:5]'
                : '[hash:base64:5]'
            }
          })
        },
        {
          test: /\.(css|scss|sass)$/,
          exclude: /\.module\.(css|scss|sass)$/,
          use: getStyleLoaders({
            modules: false
          })
        },
        {
          test: /\.(svg|png|jpe?g|gif)(\?.*)?$/i,
          use: getFileLoaders({ name: 'images/[name].[ext]' })
        },
        {
          test: /\.(eot|ttf|woff2?)(\?.*)?$/i,
          use: getFileLoaders({ name: 'fonts/[name].[ext]' })
        }
      ]
    },
    plugins: [
      new WebpackBar(),
      new MiniCssExtractPlugin({
        filename: isDev ? '[name].css' : '[name].[contenthash:8].css',
        chunkFilename: isDev
          ? '[name].chunk.css'
          : '[name].[contenthash:8].chunk.css'
      }),
      new HtmlWebpackPlugin({
        title: process.env.APP_NAME || 'React App',
        template: `${paths.assets}/index.ejs`
      })
    ]
  };

  if (isDev) {
    config.plugins = [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin()
    ];
  } else {
    config.plugins = [
      ...config.plugins,
      new CompressionWebpackPlugin({
        filename(info) {
          // info.file is the original asset filename
          // info.path is the path of the original asset
          // info.query is the query
          return `${info.path}.gz${info.query}`;
        },
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ];
  }

  return config;
}

module.exports = getWebpackConfig();
