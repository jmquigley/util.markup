import Remarkable from "remarkable";
import {PromiseFn} from "util.promise";
import {HTMLResults, MarkupParser, MarkupTool} from "./base";

const debug = require("debug")("util.markup::markdown");

export class Markdown extends MarkupParser implements MarkupTool {
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

				try {
					const md = new Remarkable();
					const html = md.render(markup);
					this.writeFile(filename, html);
					const doc = this.parseHTML(html);

					resolve({
						doc,
						filename,
						html
					});
				} catch (err) {
					reject({err});
				}
			}
		);
	}
}

export default Markdown;
