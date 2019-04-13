import {parseHTML} from "util.html";
import {PromiseFn} from "util.promise";
import {HTMLResults, MarkupParser, MarkupTool, MarkupToolOptions} from "./base";

const asciidoctor = require("asciidoctor")();

// const debug = require("debug")("util.markup::asciidoc");

export class Asciidoc extends MarkupParser implements MarkupTool {
	public constructor() {
		super();
	}

	public parse(options: MarkupToolOptions): Promise<HTMLResults> {
		return new Promise(
			(
				resolve: PromiseFn<HTMLResults>,
				reject: PromiseFn<HTMLResults>
			) => {
				try {
					this.parseOptions(options);

					const html = asciidoctor.convert(this._options.markup);
					this.writeFile(this._options.filename, html);
					const doc = parseHTML(html);

					resolve({
						doc,
						filename: this._options.filename,
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
