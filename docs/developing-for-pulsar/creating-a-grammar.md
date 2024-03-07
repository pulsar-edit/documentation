---
title: Creating a Grammar Overview
layout: doc.ejs
---

Pulsar's syntax highlighting and code folding are powered by package's referred to as Grammars.
A grammar package takes your raw text and parses it into a full [_syntax tree_](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
representing your code.

Pulsar grammar's come in a few flavors:

* TextMate
* Modern Tree-sitter
* Legacy Tree-sitter (Due to be removed in the near future)

Tree-sitter grammars are relatively new. Many languages in Pulsar are still supported by [TextMate
grammars](TODO) and TextMate grammars are easier to write from scratch, so they may still be the
best option for more obscure languages. But _if_ an up-to-date Tree-sitter parser already exists
for a language, a Tree-sitter grammar will be more performant and easier to author.

::: note
Atom (now Pulsar) was the first editor to support Tree-sitter grammars, but the legacy implementation
predated many of Tree-sitter's current features. The need for Pulsar to switch to the `web-tree-sitter`
bindings for compatibility reasons was an opportunity to update the architecture and the
original Tree-sitter grammars. The new grammars should deliver better syntax highlighting,
indentation, and code folding, while still offering better performance than TextMate-style
grammars. Legacy Tree-sitter grammars are deprecated and will soon be removed from Pulsar.
:::

## The Package

::: tip Tip

Grammar packages should start with _language-_.

:::

Every Grammar package will follow the basic [guidelines](TODO) of any other package
but does contain some minor differences. Mostly the fact that there is less usage
of keybindings, and generally the package won't contain any JavaScript, CoffeeScript, or TypeScript.

Lastly, the biggest and most important difference will be the inclusion of a `grammar` directory within the
root of the package. This directory will be what actually contains your grammars, with the format differing
based on the type of grammar.
