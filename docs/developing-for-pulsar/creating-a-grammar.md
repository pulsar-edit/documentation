---
title: Creating a grammar
layout: doc.ejs
---

Pulsar's syntax highlighting and code folding are powered by packages called _grammars_. A grammar is something that knows how to analyze a certain language in order to provide syntax highlighting, code folding, and indentation hinting.

Pulsar grammars come in a few flavors:

* TextMate
* Modern Tree-sitter
* Legacy Tree-sitter (deprecated; see note below)

[Tree-sitter grammars](../creating-a-grammar-modern-tree-sitter/) are relatively new. Many languages in Pulsar are still supported by [TextMate grammars](../creating-a-grammar-textmate/) and TextMate grammars are easier to write from scratch, so they may still be the best option for more obscure languages. Tree-sitter grammars assume the existence of a [Tree-sitter parser](https://tree-sitter.github.io/tree-sitter/#parsers) having been written for a particular language. But if such a parser exists, a Tree-sitter grammar will be more performant and easier to author.

::: note Why two Tree-sitter systems?
Atom (now Pulsar) was the first editor to support Tree-sitter grammars, but the legacy implementation predated many of Tree-sitter's current features. The need for Pulsar to switch to the `web-tree-sitter` bindings for compatibility reasons was an opportunity to update the architecture and the original Tree-sitter grammars.

The new “modern” Tree-sitter grammars should deliver better syntax highlighting, indentation, and code folding, while still offering better performance than TextMate-style grammars. “Legacy” Tree-sitter grammars are deprecated and will soon be removed from Pulsar.
:::

## The package

::: tip

Grammar package names should start with `language-`.

:::

A “grammar package” is just an ordinary Pulsar package that happens to contain one or more grammars. It can do anything that any other Pulsar package can do — run code, declare keybindings and styles, and so on — but usually doesn’t need to.

When Pulsar loads a package during startup, it will check for the existence of a `grammar` directory at the package root. This is where your grammars should be placed, with the format differing based on the type of grammar.
