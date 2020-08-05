const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { getEnv } = require('./env.loader');
const { isDev, paths } = require('./utils');

const publicPath = process.env.PUBLIC_PATH || '/';
const publicJsFolder = 'js';
const publicCssFolder = 'css';

const getStyleLoaders = (cssLoaderOptions = {}) => {
  const sourceMap = !!isDev;
  return [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: !!isDev,
        reloadAll: !!isDev
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
      options: {
        sourceMap,
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            stage: 3,
            autoprefixer: {
              grid: true,
              flexbox: 'no-2009'
            }
          })
        ]
      }
    },
    {
      loader: 'sass-loader',
      options: { sourceMap }
    }
  ];
};

const getFileLoaders = options => {
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
};

const webpackConfig = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-inline-source-map' : 'source-map',
  context: paths.client,
  entry: './App.js',
  resolve: {
    extensions: ['.jsx', '.js', '.json', '.css', '.scss', '.sass']
  },
  node: {
    child_process: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    module: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  performance: isDev
    ? { hints: false }
    : {
        maxEntrypointSize: 400000,
        maxAssetSize: 400000,
        assetFilter: assetFilename => {
          return !/\.map$/.test(assetFilename);
        }
      },
  output: {
    publicPath,
    path: paths.public,
    filename: isDev
      ? `${publicJsFolder}/[name].js`
      : `${publicJsFolder}/[name].[contenthash:8].js`,
    chunkFilename: isDev
      ? `${publicJsFolder}/[name].chunk.js`
      : `${publicJsFolder}/[name].[contenthash:8].chunk.js`
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
    new webpack.DefinePlugin(getEnv().stringified),
    new MiniCssExtractPlugin({
      filename: isDev
        ? `${publicCssFolder}/[name].css`
        : `${publicCssFolder}/[name].[contenthash:8].css`,
      chunkFilename: isDev
        ? `${publicCssFolder}/[name].chunk.css`
        : `${publicCssFolder}/[name].[contenthash:8].chunk.css`
    }),
    new HtmlWebpackPlugin({
      title: process.env.APP_NAME || 'React App',
      template: `${paths.assets}/index.ejs`,
      scriptLoading: 'defer',
      minify: false
    }),
    !isDev &&
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
  ]
};

module.exports = webpackConfig;
