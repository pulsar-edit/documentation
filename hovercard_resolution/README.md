# Hovercards

A new feature of this documentation comes in the form of Hovercards.

A hovercard helps to provide contextual information within Pulsar's docs.

By simply wrapping a word or phrase in brackets in Markdown the [`hovercard`](./markdown-it-plugins/hovercard.js`) Markdown-IT plugin
will generate a `data-hovercard` value in a span surrounding the text. Additionally, it will write down the hovercard value in `./hovercard_list.json` file in the root of this repository.

Once that list is made, after Eleventy has finished creating all aspects of the site, this module will be spun up to take that list of hovercard values, and resolve them to JSON documents that can then be retrieved via an API within the live site.

This resolution will aim to provide contextual information on all aspects of the website.
