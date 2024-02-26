# Pulsar Documentation Eleventy

This new Pulsar Documentation website utilizes `eleventy`.

This project superseedes previous efforts utilizing `sloth` as it's been determined that `eleventy` is the more mature implementation of the same exact goals of `sloth` and it makes the most sense to utilize a framework that's more mature, and requires significantly less maintenance.

## Installation

```bash
npm install
git submodule init
git sumboldule update
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

- [ ] Finalize CSS implementations
- [ ] Create all EJS templates needed
- [ ] Create collections and automatically create collection views on summary pages
- [ ] Implement Dark Mode
- [ ] Add all relevant documentation
- [ ] Update **ALL** Links!

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
