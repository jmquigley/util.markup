import {PromiseFn} from "util.promise";
import {HTMLResults, MarkupParser, MarkupTool, MarkupToolOptions} from "./base";

const {Remarkable} = require("remarkable");

// const debug = require("debug")("util.markup::markdown");

export class Markdown extends MarkupParser implements MarkupTool {
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
						const md = new Remarkable();
						html = md.render(this._options.markup);
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

export default Markdown;
