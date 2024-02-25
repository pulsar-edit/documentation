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
