# pulsar-api

This folder handles turning a JSON representation of the Pulsar API into proper HTML documentation.

* The JSON API representation is stored within the `content` directory named by the version it originated from.
* The `layouts` directory contains all of the EJS templates that are specific to this purpose.
* The `src` directory then obviously contains the JavaScript code that controls this process.

---

## Old Atom Docs

The old, original Atom docs seem to have been constructed with the following materials:

* [`joanna`](https://github.com/atom/joanna): Gathers metadata to generate JavaScript docs - compatible with donna.
* [`tello`](https://github.com/atom/tello): Digester for Donna metadata.
* [`donna`](https://github.com/atom/donna): CoffeeScript API docs.
* [`atomdoc`](https://github.com/atom/atomdoc): Atom's documentation parser for JavaScript / CoffeeScript.
* [`grunt-atomdoc`](https://github.com/atom/grunt-atomdoc): Grunt task to generate atomdoc.

As in it seems the workfow was something like:

* JavaScript Code: (`joanna` => `tello` => `atomdoc`) = `grunt-atomdoc`
* CoffeeScript Code: (`donna` => `tello` => `atomdoc`) = `grunt-atomdoc`

## Latest Version

The latest version of the API for the website to show is tracked in `./latest.json` as the `latest` key.

The latest version of the API documentation according to the above file is always available at `latest`
