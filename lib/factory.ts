import Asciidoc from "./asciidoc";
import {MarkupMode, MarkupTool} from "./base";
import Markdown from "./markdown";
import Restructuredtext from "./restructuredtext";

export class MarkupFactory {
	/**
	 * Factory method that retrieves an instance of a markup parser.  This
	 * instance exposes the toHTML and toPDF parsing instances.
	 * @param parserType {MarkupMode} - the type of parser to use.  Valid
	 * values are in the MarkupMode enum.
	 */
	public static instance(parserType: MarkupMode): MarkupTool {
		switch (parserType) {
			case MarkupMode.asciidoc:
				return new Asciidoc();

			case MarkupMode.restructuredtext:
				return new Restructuredtext();

			case MarkupMode.markdown:
			default:
				return new Markdown();
		}
	}

	/**
	 * Empty private constructor that forces the use of the .instance factory
	 * method.
	 * @constructor
	 */
	private constructor() {}
}
