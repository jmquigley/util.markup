import {JSDOM} from "jsdom";
import {isBrowser, isNode} from "util.toolbox";

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

export interface MarkupTool {
	parse(markup: string, filename?: string): Promise<HTMLResults>;
}

export abstract class MarkupParser {
	private domParser: DOMParser;

	public constructor() {
		debug("window: %o", (window as any).DOMParser);

		if (isBrowser() && "DOMParser" in window) {
			this.domParser = new (window as any).DOMParser();
		} else {
			const dom = new JSDOM();
			this.domParser = new dom.window.DOMParser();
		}
	}

	/**
	 * Takes a string of HTML and uses the DOMParser class to parse it into
	 * HTML nodes.
	 * @param html {string} - text string with HTML tags
	 * @return an HTML Document instance
	 */
	public parseHTML(html: string): Document {
		const doc: Document = this.domParser.parseFromString(html, "text/html");
		debug("parseHTML: %O", doc);
		return doc;
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
