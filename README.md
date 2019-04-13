# util.markup

> Tools for manipulating markup documents (markdown, restructuredtext, asciidoc, etc).

[![build](https://circleci.com/gh/jmquigley/util.markup/tree/master.svg?style=shield)](https://circleci.com/gh/jmquigley/util.markup/tree/master)
[![analysis](https://img.shields.io/badge/analysis-tslint-9cf.svg)](https://palantir.github.io/tslint/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![testing](https://img.shields.io/badge/testing-jest-blue.svg)](https://facebook.github.io/jest/)
[![NPM](https://img.shields.io/npm/v/util.markup.svg)](https://www.npmjs.com/package/util.markup)
[![Coverage Status](https://coveralls.io/repos/github/jmquigley/util.markup/badge.svg?branch=master)](https://coveralls.io/github/jmquigley/util.markup?branch=master)

This module is a wrapper to handle the parsing of multiple types of markup documents and outputting the results to HTML.  It uses a static factory method to retrieve a parser instance.  This parser instance contains a promise based method named `parse`.  The first parameter is a string containing the markup content to be parsed.  The second parameter is an option filename where the HTML output will be stored.  The resolution of the promise is an object with `HTMLResults` as the structure.  This factory handles the following markup types:

- [asciidoc](https://www.npmjs.com/package/asciidoctor)
- [markdown](https://www.npmjs.com/package/remarkable)
- [restructuredtext](https://www.npmjs.com/package/restructured)


## Installation

This module uses [yarn](https://yarnpkg.com/en/) to manage dependencies and run scripts for development.

To install as an application dependency:
```
$ yarn add util.markup
```

To build the production version of the app and run all tests:
```
$ yarn run all
```


## Usage

To retrieve the `MarkupFactory` parser instance use the `.instance()` factory method:

```javascript
import MarkupFactory, {HTMLResults, MarkupMode, MarkupTool, MarkupToolOptions} from "util.markup";

const content: string = '
# Header 1

Some text with *bold*

# Header 2

Some more text
';

const parser: MarkupTool = MarkupFactory.instance(MarkupMode.markdown);
const options: MarkupToolOptions = {
    markup: content,
    filename: "test.html"
}

parser.parse(options)
    .then((results: HTMLResults) => {
        // Do something with the output HTML
        console.log(results.html);      // HTML structure as a string
        console.log(results.doc);       // HTML Document instance of the html
        console.log(results.filename);  // the filename where the HTML will be saved
    })
    .catch((err: string) => {
        // Caputure possible error
    });
```


## API

#### functions

#### properties
