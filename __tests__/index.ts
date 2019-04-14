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

test("Retrieve a asciidoc parser and convert to HTML", () => {
	const parser: MarkupTool = MarkupFactory.instance(MarkupMode.asciidoc);
	assert(parser);
	const fixture = new Fixture("asciidoc");
	assert(fixture);
	const txt = fixture.read("file.txt");
	assert(txt);
	const outfile = join(fixture.dir, "test.html");

	return parser
		.parse({markup: txt, outfile})
		.then((results: HTMLResults) => {
			expect(results.html).toMatchSnapshot();
			assert(fs.existsSync(results.filename));
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
		.parse({markup: md, outfile})
		.then((results: HTMLResults) => {
			expect(results.html).toMatchSnapshot();
			assert(fs.existsSync(results.filename));
		})
		.catch((err: string) => console.error(err));
});

test("Retrieve a restructuredtext parser and convert to HTML", () => {
	const parser: MarkupTool = MarkupFactory.instance(
		MarkupMode.restructuredtext
	);
	assert(parser);
	const fixture = new Fixture("restructuredtext");
	assert(fixture);
	const rst = fixture.read("file.rst");
	assert(rst);
	const outfile = join(fixture.dir, "test.html");

	return parser
		.parse({markup: rst, outfile})
		.then((results: HTMLResults) => {
			expect(results.html).toMatchSnapshot();
			assert(fs.existsSync(results.filename));
		})
		.catch((err: string) => console.error(err));
});
