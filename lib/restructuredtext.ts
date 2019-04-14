import {nl} from "util.constants";
import {PromiseFn} from "util.promise";
import {HTMLResults, MarkupParser, MarkupTool, MarkupToolOptions} from "./base";

const restructured = require("restructured").default;
const debug = require("debug")("util.markup::restructuredtext");
const pkg = require("../package.json");

enum RsTElementType {
	blockquote = "blockquote",
	bullet_list = "bullet_list",
	citation_reference = "citation_reference",
	definition = "definition",
	definition_list = "definition_list",
	definition_list_item = "definition_list_item",
	document = "document",
	emphasis = "emphasis",
	enumerated_list = "enumerated_list",
	footnote_reference = "footnote_reference",
	line = "line",
	line_block = "line_block",
	list_item = "list_item",
	literal = "literal",
	literal_block = "literal_block",
	paragraph = "paragraph",
	reference = "reference",
	section = "section",
	strong = "strong",
	substitution_reference = "substitution_reference",
	term = "term",
	text = "text",
	transition = "transition"
}

interface RsTElement {
	type: RsTElementType;
	depth?: number;
	value?: string;
	bullet?: string;
	children: RsTElement[];
}

export class Restructuredtext extends MarkupParser implements MarkupTool {
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

					const elements = restructured.parse(this._options.markup);

					if (pkg.debug) {
						if (this._options.outfile) {
							this.writeFile(
								`${this._options.outfile}.json`,
								JSON.stringify(elements, null, 4)
							);
						}

						this.showRsTElements(elements);
					}

					let html = this.buildHTML(elements);
					html = this.applyTemplate(html);
					this.writeFile(this._options.outfile, html);

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

	private buildHTML(element: RsTElement): string {
		switch (element.type) {
			case RsTElementType.blockquote:
				return this.parseTag(element, "blockquote", true);

			case RsTElementType.bullet_list:
				return this.parseTag(element, "ul", true);

			case RsTElementType.definition:
				return this.parseTag(element, "dd");

			case RsTElementType.definition_list:
				return this.parseTag(element, "dl", true);

			case RsTElementType.definition_list_item:
				return this.parseDefinitionListItem(element);

			case RsTElementType.document:
				return this.parseTag(element, "div", true);

			case RsTElementType.line:
				return this.parseLine(element);

			case RsTElementType.line_block:
				return this.parseTag(element, "div", true, "line_block");

			case RsTElementType.literal_block:
				return this.parseLiteralBlock(element);

			case RsTElementType.emphasis:
				return this.parseTag(element, "em");

			case RsTElementType.enumerated_list:
				return this.parseTag(element, "ol", true);

			case RsTElementType.list_item:
				return this.parseListItem(element);

			case RsTElementType.literal:
				return this.parseTag(element, "code");

			case RsTElementType.paragraph:
				return this.parseParagraph(element);

			case RsTElementType.reference:
			case RsTElementType.substitution_reference:
			case RsTElementType.footnote_reference:
			case RsTElementType.citation_reference:
				return this.parseReference(element);

			case RsTElementType.section:
				return this.parseSection(element);

			case RsTElementType.strong:
				return this.parseTag(element, "strong");

			case RsTElementType.term:
				return this.parseTag(element, "dt");

			case RsTElementType.text:
				return this.parseText(element);

			case RsTElementType.transition:
				return this.parseTransition();

			default:
				const s: string = `ZORP type: ${element.type}: ${JSON.stringify(
					element
				)}${nl}`;
				console.warn(s);
				return s;
		}
	}

	private parseChildren(
		element: RsTElement,
		newline: boolean = false
	): string {
		const tagNL = newline ? nl : "";
		return element.children
			.map((it) => {
				return `${this.buildHTML(it)}${tagNL}`;
			})
			.join("");
	}

	private parseDefinitionListItem(element: RsTElement): string {
		const term = this.buildHTML(element.children[0]);
		const definition = this.buildHTML(element.children[1]);

		return `${term}${definition}`;
	}

	private parseLine(element: RsTElement): string {
		const lines = element.children
			.map((it) => {
				let s = "<br />";
				s += this.buildHTML(it).replace(" ", "&nbsp;");
				s += nl;

				return s;
			})
			.join("");

		return lines;
	}

	private parseListItem(element: RsTElement): string {
		const item = element.children
			.map((p) => {
				if (p.type === RsTElementType.paragraph) {
					return this.parseChildren(p);
				} else {
					return this.buildHTML(p);
				}
			})
			.join("")
			.rstrip();

		return `<li>${item}</li>${nl}`;
	}

	private parseLiteralBlock(element: RsTElement): string {
		const lines = this.parseChildren(element, true);
		return `${nl}<code><pre>${nl}${lines}</pre></code>${nl}`;
	}

	private parseParagraph(element: RsTElement): string {
		const lines = this.parseChildren(element);
		return lines + "<br />".repeat(2) + nl;
	}

	private parseReference(element: RsTElement): string {
		const lines = this.parseChildren(element);
		return `<span class="reference">${lines}</span>`;
	}

	private parseSection(element: RsTElement): string {
		const titleChildren = this.parseChildren(element.children[0]);
		const children = element.children
			.slice(1)
			.map((it) => this.buildHTML(it))
			.join("");

		let s: string = "";
		s += `${nl}<h${element.depth}>${titleChildren}</h${
			element.depth
		}>${nl}`;
		s += `${children}${nl}`;

		return s;
	}

	private parseTag(
		element: RsTElement,
		tag: string,
		blockTag: boolean = false,
		className?: string
	): string {
		const children = this.parseChildren(element);
		const tagNL = blockTag ? nl : "";

		let tagClassName = "";
		if (className) {
			tagClassName = ` class="${className}"`;
		}

		return `${tagNL}<${tag}${tagClassName}>${tagNL}${children}</${tag}>${tagNL}`;
	}

	private parseText(element: RsTElement): string {
		return `${element.value}`;
	}

	private parseTransition(): string {
		return `<hr />`;
	}

	private showRsTElements(elements: RsTElement) {
		function preorder(children: RsTElement[]) {
			for (const childElement of children) {
				debug("element: %O", childElement);

				if (
					"children" in childElement &&
					childElement.children.length > 0
				) {
					preorder(childElement.children);
				}
			}
		}

		preorder(elements.children);
	}
}

export default Restructuredtext;
