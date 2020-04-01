# resumed-cli

[![](https://badge.fury.io/js/resumed-cli.svg)](https://www.npmjs.org/package/resumed-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org), the open source initiative to create a JSON-based standard for resumes.

[Read more...](https://jsonresume.org/schema/)


# Getting Started

Install the command-line tool:

```
npm install -g resumed-cli
```


# Usage

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

If no theme is specified, it will look for the file `index.js` and call 
`render()`. This is useful when developing themes.



# License

Available under [the MIT license](http://mths.be/mit).
