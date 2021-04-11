const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    manus2ics: "./src/manus2ics.ts",
    downloadics: "./src/downloadics.ts",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
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
  optimization: {
    runtimeChunk: false,
  },
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
