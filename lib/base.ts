import "util.string";

import {sprintf} from "sprintf-js";
import {encoding} from "util.constants";
import {isNode} from "util.toolbox";

const debug = require("debug")("util.markup::markdown");

export enum MarkupMode {
	asciidoc = "asciidoc",
	markdown = "markdown",
	md = "markdown",
	restructuredtext = "restructuredtext",
	rst = "restructuredtext"
}

export interface HTMLResults {
	err?: string;
	filename?: string;
	html?: string;
}

export interface MarkupToolOptions {
	css?: string;
	infile?: string;
	markup?: string;
	outfile?: string;
}

export interface MarkupTool {
	parse(options: MarkupToolOptions): Promise<HTMLResults>;
}

const defaultOptions: MarkupToolOptions = {
	markup: "",
	infile: "",
	outfile: "output.html",
	css: `
		h2 {color: #ea1a1a};
	`
};

const template: string = `
<!DOCTYPE html>

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="description" content="util.markup" />
		<style>
		%s
		</style>
	</head>

	<body>
	%s
	</body>
</html>
`;

export abstract class MarkupParser {
	protected _options: MarkupToolOptions = {...defaultOptions};

	public constructor() {}

	/**
	 * Takes the current markup file and wraps a template around it.  It also
	 * injects CSS for custom styling.
	 * @param markup {string} - the markup that will be wrapped by the tempalte
	 * @returns a new HTML string with the template and CSS applied
	 */
	protected applyTemplate(markup: string): string {
		return sprintf(template, this._options.css, markup);
	}

	/**
	 * Parses the options object passed to the parse function.
	 * @param options {MarkupToolOptions} - an object that contains options
	 * for the parser.
	 */
	protected parseOptions(options: MarkupToolOptions) {
		this._options = Object.assign({...defaultOptions}, options);

		if (isNode && this._options.markup === "") {
			const fs = require("fs-extra");
			if (fs.existsSync(this._options.infile)) {
				console.log(`Processing markup file ${this._options.infile}`);
				this._options.markup = fs.readFileSync(
					this._options.infile,
					encoding
				);
			}
		}

		debug("parseOptions -> %O", this._options);
	}

	/**
	 * A wrapper function for writing output data for all underlying markup
	 * methods.
	 * @param filename {string} - the name of the output file to write
	 * @param data {stirng} - the output HTML data to write
	 */
	public writeFile(filename: string, data: string) {
		if (isNode && filename && data) {
			debug("Creating output file: %o", filename);
			const fs = require("fs-extra");
			fs.writeFileSync(filename, data);
		}
	}
}
