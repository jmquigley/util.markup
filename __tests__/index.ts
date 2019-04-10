import * as fs from "fs-extra";
import * as path from "path";
import assert from "power-assert";
import {cleanup, Fixture} from "util.fixture";
import {join} from "util.join";
import MarkupFactory, {HTMLResults, MarkupMode, MarkupTool} from "../index";

const debug = require("debug")("util.markup::test");

afterAll((done) => {
	cleanup({done, message: path.basename(__filename)});
});

test("Retrieve a asciidoc parser", () => {
	const parser: MarkupTool = MarkupFactory.instance(MarkupMode.asciidoc);
	assert(parser);
	const fixture = new Fixture("asciidoc");
	assert(fixture);
	const txt = fixture.read("file.txt");
	assert(txt);
	const outfile = join(fixture.dir, "test.html");

	return parser
		.parse(txt, outfile)
		.then((output: HTMLResults) => {
			expect(output.html).toMatchSnapshot();
			assert(fs.existsSync(output.filename));

			output.doc.querySelectorAll("*").forEach((it: any) => {
				assert(it);
				debug(" -> %O, %o", it, it.nodeName);
			});
		})
		.catch((err: string) => console.error(err));
});

test("Retrieve a markdown parser and convert to HTML", () => {
	const parser: MarkupTool = MarkupFactory.instance(MarkupMode.markdown);
	assert(parser);
	const fixture = new Fixture("markdown");
	assert(fixture);
	const md = fixture.read("file.md");
	assert(md);
	const outfile = join(fixture.dir, "test.html");

	return parser
		.parse(md, outfile)
		.then((output: HTMLResults) => {
			expect(output.html).toMatchSnapshot();
			assert(fs.existsSync(output.filename));

			output.doc.querySelectorAll("*").forEach((it: any) => {
				assert(it);
				debug(" -> %O, %o", it, it.nodeName);
			});
		})
		.catch((err: string) => console.error(err));
});

test("Retrieve an restructuredtext parser", () => {
	const parser: MarkupTool = MarkupFactory.instance(MarkupMode.asciidoc);
	assert(parser);
});
