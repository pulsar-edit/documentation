---
title: Tools of the Trade
layout: doc.ejs
---

To begin, there are a few things we'll assume you know, at least to some degree.
Since all of Pulsar is implemented using web technologies, we have to assume you
know web technologies such as JavaScript and CSS. Specifically, we'll be using
Less, which is a preprocessor for CSS.

While the majority of Pulsar is written in JavaScript, there may still be some
sections of code still implemented in CoffeeScript. Any CoffeeScript that is found
is intended to be converted to JavaScript through "decaffeination", which you can
read more about [here](https://github.com/pulsar-edit/.github/blob/main/guides/how-to-decaf.md).

Additionally, Pulsar's default configuration language is CSON, which is based on
CoffeeScript. If you don't know CoffeeScript, but you are familiar with
JavaScript, you shouldn't have too much trouble. Here is an example of some
simple CoffeeScript code:

```coffee
MyPackageView = require './my-package-view'

module.exports =
  myPackageView: null

  activate: (state) ->
    @myPackageView = new MyPackageView(state.myPackageViewState)

  deactivate: ->
    @myPackageView.destroy()

  serialize: ->
    myPackageViewState: @myPackageView.serialize()
```

We'll go over examples like this in a bit, but this is what the language looks
like. Just about everything you can do with CoffeeScript in Pulsar is also
doable in JavaScript. You can brush up on CoffeeScript at [coffeescript.org](http://coffeescript.org).

Less is an even simpler transition from CSS. It adds a number of useful things
like variables and functions to CSS. You can learn about Less at [lesscss.org](http://lesscss.org/).
Our usage of Less won't get too complex in this book however, so as long as you
know basic CSS you should be fine.
