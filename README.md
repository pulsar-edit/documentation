# Pulsar Documentation Eleventy

This new Pulsar Documentation website utilizes `eleventy`.

This project superseedes previous efforts utilizing `sloth` as it's been determined that `eleventy` is the more mature implementation of the same exact goals of `sloth` and it makes the most sense to utilize a framework that's more mature, and requires significantly less maintenance.

## Installation

```bash
npm install
git submodule init
git submodule update
```

## Running

* `npm run build`: Builds the site
* `npm run serve`: Creates a live version of the site at `:8080`
* `npm run build:debug`: Builds the site with debug flags set
* `npm run serve:debug`: Creates a live server with debug flags set

## Tool Translations from current Pulsar site to this one

While obviously nearly all text should be redone, there are also some technical changes that should occur:

### KDB

Switch uses of `<kdb>Ctrl</kdb>` to `[[Ctrl]]`

### Images

Switch links with `@images` to `/img`

## TODO's

The biggest aspects of this that still have to be completed:

- [X] Finalize CSS implementations
- [X] Create all EJS templates needed
- [X] Create collections and automatically create collection views on summary pages
- [X] Implement Dark Mode
- [X] Implement Light Mode
- [X] Implement Theme Switcher
- [X] Add all original Launch Manual Docs
- [X] Add all relevant documentation
- [X] Implement Pulsar API Docs
- [X] Implement Hovercards
- [ ] Update **ALL** Links!
- [ ] Ensure all sidebar descriptions are filled in
- [ ] Add support for syntax highlighting
- [ ] Design CSS to account for indented returns in the API view
- [X] Find a way to generate API docs from most recent Pulsar versions
- [X] GHA to generate new Pulsar Docs once above is done
- [ ] Wait for `pulsardoc` to support Coffee and enable coffee based repos to document

## Style Guide

Here will be the very short, non-complete style guide:

### Links to GitHub

If linking to a resource on GitHub, such as the `language-git` package, ensure to never include the branch.

By default if you copy paste the link to the `language-git` package it will look like:
  `https://github.com/pulsar-edit/pulsar/tree/master/packages/language-git`

But in the rare event the branch name never changes, we can make simple changes now to avoid stress later, by replacing the `master` here with `HEAD`, such as:
  `https://github.com/pulsar-edit/pulsar/tree/HEAD/packages/language-git`

### Heading Levels

Within each page of markdown you should never include an `<h1>` heading level (`#`) always start on `<h2>` (`##`) as the title of the page is extracted and used as a level one heading in all cases.

### Links between pages

For simplicity, and ability to find and replace links in the future, all links between pages should be from the root of the website.

Meaning start all links with `/` and direct to the page you are attempting to link to.

A safe exception to this rule is for anchor links on the same page, as those can just be the anchor itself.

But for all other links, please do follow this rule and do not use relative links.

Examples: When linking to `/example/sub/page` from `/example/sub/hello`
  - Do: `/example/sub/page`
  - Do **NOT**: `../page`

## Update Source Code Documentation

### Auto

Create an issue against this repository, with the title formatted strictly as the new Pulsar version number.
Such as `1.124.0`

Then once the issue is created, afterwards add the label `update-docs`

After a short time a PR will be created against the repository with the changes to go ahead and review.

### Manual

1) Update the JSON file `./pulsar-api/latest.json` with the newest Pulsar version.
2) Update all submodules to their latest commit, such as `git submodule update --remote --merge`
3) Run `npm run generate:docs` to trigger the documentation to be updated.
