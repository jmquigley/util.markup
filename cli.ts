#!/usr/bin/env node

//
// Command line to take a markup type file and convert it to HTML
//
// Example:
//
// markup -t md -i file.md -o output.hml
//

const fs = require("fs-extra");
const {MarkupFactory} = require("./index.umd.min");

const argv = require("yargs")
	.usage("Usage: markup -t <asciidoc|md|rst> -i {filename} -o {filename}")
	.alias("i", "infile")
	.describe("i", "Input file to process")
	.alias("o", "outfile")
	.describe("o", "Output file to save HTML contents")
	.default("o", "output.html")
	.alias("t", "type")
	.describe("t", "Choose the markup file type")
	.choices("t", ["asciidoc", "markdown", "md", "rst", "restructuredtext"])
	.demandOption(["i", "t"])
	.version()
	.help()
	.showHelpOnFail(false, "Specify --help for available options").argv;

const parser = MarkupFactory.instance(argv.type);
parser.parse({
	infile: argv.infile,
	outfile: argv.outfile
});
