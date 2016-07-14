module.exports = {
  context: __dirname,
  entry: "./entry.js",
  output: {
    path: "./",
    filename: "bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  devtool: 'source-map'
};
