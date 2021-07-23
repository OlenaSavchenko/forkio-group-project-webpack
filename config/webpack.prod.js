//common
const commonConfig = require("./webpack.common");
const { merge } = require("webpack-merge"); //обьединяет common и prod webpack
const paths = require("./paths");
const glob = require("glob-all");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); //очистка папки dist
//css
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //экспортирует минифицированный CSS в отдельный файл
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // минифицирует css
const PurgecssPlugin = require("purgecss-webpack-plugin"); //удаляет неиспользуемый CSS
//img
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin"); // оптимизация картинок
const { extendDefaultPlugins } = require("svgo"); //оптимизация svg

module.exports = merge(commonConfig, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader", //преобразовывает CSS - в модуль JavaScript.
            options: {
              importLoaders: 2, //количество предыдущих используемых loaders
              sourceMap: false, //отключает sourceMap
            },
          },
          "postcss-loader", //добавляет вендорные префиксы
          "sass-loader", //загружает SCSS и компилирует его в CSS
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "styles.min.[contenthash].css",
    }),
    new PurgecssPlugin({
      paths: glob.sync([
        paths.purgecss + "/index.html",
        paths.purgecss + "/js/*.js",
      ]),
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],

          [
            "svgo",
            {
              plugins: extendDefaultPlugins([
                {
                  name: "removeViewBox",
                  active: false,
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                  },
                },
              ]),
            },
          ],
        ],
      },
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), "..."],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
