# Architecture

> As inspired by [matklad](https://matklad.github.io/2021/02/06/ARCHITECTURE.md.html)

This document describes the high-level architecture of Pulsar's `pulsar-documentation-eleventy`.
If you want to familiarize yourself with the code base, you are just in the right place!

## Code Map

This section touches on briefly about the various directories within the project and what's within them.
Ideally helpful to locating the location of a new feature or to fix an existing bug.

### `docs`

This is arguably the most important directory. As it contains the actual documentation of the entire generated website.

* `*.11tydata.json`: This is data JavaScript file that's automatically used by Eleventy.
* `index.md`: Will be the landing page within each section.
* `*.md`: Generic documentation as Markdown.
* `*.njk`: A Eleventy specific template file, helpful for generating non-documentation files for the website.

### `submodules`

This directory contains several submodules, allowing this repo to collect data about other repos/packages.

### `pulsar-api`

This directory manages the Pulsar API JSON files. Documenting the API of Pulsar itself.

This directory is used to generate new docs, handle the existing ones, and generate HTML templates from existing docs.

### `static`

A collection of static files added to the final website.

### `plugins`

Here are plugins used for Eleventy. Adding support for new file types and functions.

### `markdown-it-plugins`

Here are plugins used for `markdown-it`. Adding new handling of Markdown Content.

### `less`

Here are the Less stylesheets.

### `layouts`

Here are the EJS template layouts.

### `hovercard_resolution`

Here are files aimed at resolving hovercards.

### `data`

Data files applied to the Eleventy docs.

### `_partial_docs`

Any partial document fragments we want that can be used many times within the docs.
Helpful if there's a piece of information that appears more than once. We can ensure it only has to be updated once.
