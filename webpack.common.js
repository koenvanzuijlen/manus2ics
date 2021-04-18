const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

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
    new CopyPlugin({
      patterns: [
        { from: "./src/manifest.json", transform: fillManifest },
        { from: "./icon/*.png", to: "./" },
      ],
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
