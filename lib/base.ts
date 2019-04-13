import "util.string";

import {isNode} from "util.toolbox";

const debug = require("debug")("util.markup::markdown");

export enum MarkupMode {
	asciidoc,
	markdown,
	restructuredtext,
	text
}

export interface HTMLResults {
	doc?: Document;
	err?: string;
	filename?: string;
	html?: string;
}

export interface MarkupToolOptions {
	markup: string;
	css?: string;
	filename?: string;
}

export interface MarkupTool {
	parse(options: MarkupToolOptions): Promise<HTMLResults>;
}

const defaultOptions: MarkupToolOptions = {
	markup: "",
	filename: "",
	css: `
		h1 {color: #2f2f2f};
	`
};

export abstract class MarkupParser {
	protected _options: MarkupToolOptions = {...defaultOptions};

	public constructor() {}

	protected parseOptions(options: MarkupToolOptions) {
		this._options = Object.assign({...defaultOptions}, options);
		debug(
			"parse -> markup: %O, filename: %o",
			this._options.markup,
			this._options.filename
		);
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
