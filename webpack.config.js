const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/app.ts",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/manifest.json", transform: fillManifest }],
    }),
  ],
};

function fillManifest(buffer) {
  const { version, name, description } = require("./package.json");
  return JSON.stringify(
    {
      ...JSON.parse(String(buffer)),
      name,
      description,
      version,
    },
    null,
    2
  );
}
