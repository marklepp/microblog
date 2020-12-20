const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    main: {
      import: path.resolve(__dirname, "src", "public", "js", "main.js"),
      filename: "restricted.[name].bundle.js",
    },
    login: path.resolve(__dirname, "src", "public", "js", "login.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react"],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "views", "index.html"),
      chunks: ["main"],
      filename: "restricted.main.html",
      favicon: path.join(__dirname, "src", "public", "img", "fav.png"),
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "views", "index.html"),
      chunks: ["login"],
      filename: "login.html",
      favicon: path.join(__dirname, "src", "public", "img", "fav.png"),
    }),
  ],
};
