import {PromiseFn} from "util.promise";
import {HTMLResults, MarkupParser, MarkupTool} from "./base";

const debug = require("debug")("util.markup::restructuredtext");

export class Restructuredtext extends MarkupParser implements MarkupTool {
	public constructor() {
		super();
	}

	public parse(markup: string, filename?: string): Promise<HTMLResults> {
		return new Promise(
			(
				resolve: PromiseFn<HTMLResults>,
				reject: PromiseFn<HTMLResults>
			) => {
				debug("toHTML -> markup: %O, filename: %o", markup, filename);
				resolve({});
				reject({});
			}
		);
	}
}

export default Restructuredtext;
