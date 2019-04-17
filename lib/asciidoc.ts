import {PromiseFn} from "util.promise";
import {HTMLResults, MarkupParser, MarkupTool, MarkupToolOptions} from "./base";

const AsciiDoctor = require("asciidoctor");

// const debug = require("debug")("util.markup::asciidoc");

export class Asciidoc extends MarkupParser implements MarkupTool {
	private asciidoctor = AsciiDoctor();

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

					let html: string = "";
					if (this._options.markup) {
						html = this.asciidoctor.convert(this._options.markup);
						html = this.applyTemplate(html);
						this.writeFile(this._options.outfile, html);
					}

					resolve({
						filename: this._options.outfile,
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
