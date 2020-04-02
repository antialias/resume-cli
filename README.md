# resumed-cli

[![](https://badge.fury.io/js/resumed-cli.svg)](https://www.npmjs.org/package/resumed-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org), the open source initiative to create a JSON-based standard for resumes.

[Read more...](https://jsonresume.org/schema/)


# Getting Started

Install the command-line tool:

```
npm install -g resumed-cli
```


# commands

## `resumed --help`

Show a list of options and commands for the <abbr title="Command Line Interface">CLI</abbr>.


## `resumed init`

Creates a new `resume.json` file in your current working directory.

Complete the `resume.json` with your text editor. Be sure to follow the schema 
(available at http://jsonresume.org).


## `resumed validate`

Validates your `resume.json` against our schema tests to ensure it complies with 
the standard. Tries to identify where any errors may be occurring.


## `resumed export [fileName]`

Exports your resume locally in a stylized HTML, Markdown, or PDF format.

A list of available themes can be found here: http://jsonresume.org/themes/

Please npm install the theme you wish to use locally before attempting to export it.

Options:
  - `--format <file type>` Example: `--format pdf`
  - `--theme <name>` Example: `--theme flat`  

## `resume serve`

Starts a web server that serves your local `resume.json`.  

Options: 
  - `--port <port>`
  - `--theme <name>`

## supported resume types

* [`json`](https://www.json.org/json-en.html): via `JSON.parse`.
* [`yaml`](https://yaml.org/): via [`yaml-js`](https://www.npmjs.com/package/yaml-js)
* `quaff`:  if `--resume` is a directory, then the path is passed to [`quaff`](https://www.npmjs.com/package/quaff) and the resulting json is used as the resume. quaff supports a variety of formats in the directory, including javascript modules.

## local theme development

Set `--theme` to the path of a local module that exports a theme.

## resolution

For the export and serve commands use a sequence of algorithms to determine where the resume data comes from, what theme to use, how it should be rendered (e.g. `pdf` or `html`), and where the output is sent.

### themes

The theme is found  by passing the `--theme` option (as `theme`) through the following algorithm:
1. `theme` => `themePath`
    * if `theme` only contains characters in the class `[0-9a-zA-Z-]` and does not already begin with `jsonresume-theme-`, then the aforementioned string is appended as a prefix and used as `themePath`
    * else `set themePath` to `theme`
1. import the theme
    * `themePath` is passed through [`require.resolve`](https://nodejs.org/api/modules.html#modules_require_resolve_request_options) with `options.path` set to `process.cwd()`. If a module is found this way it is used as the theme for rendering the resume.
    * else if `--remote-fallback` is not set, throw an error
    * use the server specified by `--remote-fallback` to render the resume using `theme`

### resume data

Resume data is read from `stdin` if [`stdin.isTTY`](https://nodejs.org/api/tty.html#tty_readstream_istty) is falsy. Otherwise, the resume is read from `--path` as resolved from `process.cwd()`. `--type` defaults to `application/json`. Supported resume data mime types are:
* `application/json`
* `text/yaml`

### _for the `export` command only:_
#### rendering function
The output type (and therefore the function used to render the resume data with the theme) is set by the `--type` option if specified, otherwise the file extension of `[fileName]` is used to determine the output type. Supported types are:
* `pdf`
* `html`

### output
if `[fileName]` is not provided, output is sent to `stdout`.

# License

Available under [the MIT license](http://mths.be/mit).
