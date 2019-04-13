import "util.string";

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
	doc?: Document;
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
		h1 {color: #2f2f2f};
	`
};

export abstract class MarkupParser {
	protected _options: MarkupToolOptions = {...defaultOptions};

	public constructor() {}

	protected parseOptions(options: MarkupToolOptions) {
		this._options = Object.assign({...defaultOptions}, options);

		if (isNode && this._options.markup === "") {
			debug("read file from command line");
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
