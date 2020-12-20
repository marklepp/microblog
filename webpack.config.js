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
  mode: "production",
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "views", "index.html"),
      chunks: ["main"],
      filename: "restricted.main.html",
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "views", "index.html"),
      chunks: ["login"],
      filename: "login.html",
    }),
  ],
};
