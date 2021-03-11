const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { getEnv } = require('./env.config');
const { isDev, paths } = require('./utils');

const publicPath = process.env.PUBLIC_PATH || '/';
const publicBuild = 'build';
const devServerPort = 3000;

const getStyleLoaders = (cssLoaderOptions = {}) => {
  const sourceMap = !!isDev;
  return [
    {
      loader: MiniCssExtractPlugin.loader
    },
    {
      loader: require.resolve('css-loader'),
      options: {
        sourceMap,
        importLoaders: 2,
        ...cssLoaderOptions
      }
    },
    {
      loader: require.resolve('postcss-loader'),
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
      loader: require.resolve('sass-loader'),
      options: { sourceMap }
    }
  ];
};

const getFileLoaders = options => {
  return [
    {
      loader: require.resolve('url-loader'),
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
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',
  context: paths.client,
  entry: './index.js',
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
      ? `${publicBuild}/[name].js`
      : `${publicBuild}/[name].[contenthash:8].js`,
    chunkFilename: isDev
      ? `${publicBuild}/[name].chunk.js`
      : `${publicBuild}/[name].[contenthash:8].chunk.js`
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserJSPlugin({
        /* set your options here, if any */
      }),
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
          loader: require.resolve('babel-loader'),
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
        use: getFileLoaders({
          name: `${publicBuild}/[name].[ext]`
        })
      },
      {
        test: /\.(eot|ttf|woff2?)(\?.*)?$/i,
        use: getFileLoaders({
          name: `${publicBuild}/[name].[ext]`
        })
      }
    ]
  },
  plugins: [
    new WebpackBar(),
    new webpack.DefinePlugin(getEnv().stringified),
    new MiniCssExtractPlugin({
      filename: isDev
        ? `${publicBuild}/[name].css`
        : `${publicBuild}/[name].[contenthash:8].css`,
      chunkFilename: isDev
        ? `${publicBuild}/[name].chunk.css`
        : `${publicBuild}/[name].[contenthash:8].chunk.css`
    }),
    new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          title: process.env.APP_NAME || 'React App',
          template: `${paths.assets}/templates/index.ejs`,
          scriptLoading: 'defer'
        },
        !isDev && {
          minify: {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            trimCustomFragments: true
          }
        }
      )
    )
  ],
  devServer: {
    port: devServerPort,
    host: 'localhost',
    stats: 'minimal',
    compress: true,
    hot: true,
    open: true,
    historyApiFallback: true,
    publicPath,
    contentBase: paths.publicPath,
    proxy: {
      '/api': `http://localhost:${process.env.PORT || 5000}`
    }
  }
};

// opt in plugins based on current environment mode
if (isDev) {
  webpackConfig.plugins = [
    ...webpackConfig.plugins,
    new webpack.HotModuleReplacementPlugin()
  ];
} else {
  webpackConfig.plugins = [
    ...webpackConfig.plugins,
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

module.exports = webpackConfig;
