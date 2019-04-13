const path = require("path");
const webpack = require("webpack");
const pkg = require("./package.json");

let mode = process.env.NODE_ENV || "development";
let externals = Object.keys(pkg.dependencies);

module.exports = {
	mode,
	performance: {hints: false},
	node: {
		fs: "empty"
	},
	entry: [path.resolve(__dirname, "index.js")],
	output: {
		path: path.resolve(__dirname),
		filename: "index.umd.min.js",
		libraryTarget: "umd",
		globalObject: "this"
	},
	resolve: {
		extensions: [".js", ".css"],
		alias: {
			jspdf: path.resolve(
				__dirname,
				"node_modules",
				"jspdf",
				"dist",
				"jspdf.node.debug.js"
			)
		}
	},
	resolveLoader: {
		modules: [path.join(__dirname, "node_modules")]
	},
	externals,
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules|.*\.d.ts/,
				loader: "babel-loader"
			}
		]
	}
};
