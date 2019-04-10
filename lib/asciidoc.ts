import {PromiseFn} from "util.promise";
import {HTMLResults, MarkupParser, MarkupTool} from "./base";

const asciidoctor = require("asciidoctor")();
const debug = require("debug")("util.markup::asciidoc");

export class Asciidoc extends MarkupParser implements MarkupTool {
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
					const html = asciidoctor.convert(markup);
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

export default Asciidoc;
