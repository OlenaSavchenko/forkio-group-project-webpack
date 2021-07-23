const HtmlWebpackPlugin = require("html-webpack-plugin"); // загрузка html в dist с добавлением ссылки на скрипт и стили
const paths = require("./paths");
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  entry: [paths.src + "/index.js"],
  output: {
    path: paths.dist,
    filename: "scripts.min.[contenthash].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.src + "/index.html", // исходный файл
      filename: isProd ? "index.[contenthash].html" : "index.html", // выходной файл
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"], //преобразование новых конструкций для старых браузеров (транспиляция файлов ) уточнить о версиях браузера
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: "asset/resource", // обработка изображений с помощью url-loader
        generator: {
          filename: isProd ? `img/[name].[hash][ext]` : `img/[name][ext]`,
        },
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: "asset/resource", // обработка шрифтов с помощью url-loader
        generator: {
          filename: isProd ? `fonts/[name].[hash][ext]` : `fonts/[name][ext]`,
          publicPath: "../",
        },
      },
    ],
  },
  resolve: {
    modules: [paths.src, "node_modules"],
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": paths.src,
    },
  },
  target: isProd ? "browserslist" : "web", //для перезагрузки браузера при каждом изменении кода (особенности webpack5)
};
