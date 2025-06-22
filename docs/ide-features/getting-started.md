---
title: "Getting started"
layout: doc.ejs
---

## What are IDE features?

Definitions of “IDE” ([integrated development environment](https://en.wikipedia.org/wiki/Integrated_development_environment)) vary, but it’s common to think of an IDE as a code editor that offers deep integration with a specific language or technical stack.

A cross-language editor like Pulsar has built-in support for a couple dozen languages and can be extended to support more. But “support,” in this case, means syntax highlighting, indentation hinting, code folding, and the ability to apply all these features to files of one or more specific extensions. Some language packages can also identify symbols in the current file — method names and other important sections.

Pulsar needs external help for deeper integration such as the following:

* Project-wide symbol identification, including jumping to a symbol’s declaration
* Contextual autocompletion (knowing what’s valid to suggest at the cursor position for the given language)
* Linting (code diagnostics, highlighting errors, offering suggestions)
* Refactoring (renaming of symbols or applying “quick fix” actions)
* Navigating code files by hierarchical “outline”
* Intelligent code formatting

But for most mainstream languages, that external help already exists!

## What are language servers?

A language server is a “brain” designed to supply all the logic needed to support features like those listed above.

For a given language, instead of writing a specific deep integration with each commonly used code editor in the world, it’s easier to write _one_ deep integration that abides by the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/). Each editor can then write its own adapter to communicate according to that protocol.

The Language Server Protocol therefore functions as “middleware”: each language community can write a language server in whatever way they please, with whatever tools they want, as long as it fulfills its end of the protocol. Likewise, every code editor can write a <cite>language client</cite> that implements the other half of the protocol, then wires it up to the specific features that editor can support.

This reduces vendor lock-in and makes it easier for the Pulsars of the world to offer IDE-like features.

## Why do we need language servers?

Some of the features listed above have been able to be delivered through various means even _without_ language servers. For example, Pulsar has builtin packages for {autocomplete-css "CSS"} and {autocomplete-html "HTML"} autocompletion because, given a document and a cursor position, it’s comparatively easy to understand which kinds of suggestions would be contextually valid. But even these packages use techniques that aren’t as robust as what a language server can provide.

Also, language servers are exciting because they offer a way for a single piece of software to meet the needs of many different IDE features at once. Lots of the IDE features mentioned above rely on the same code analysis techniques, so it only makes sense for one tool to do all the analysis within your project and deliver all these features at once.

## How do I get them?

Using language servers in Pulsar is a two-step process:

1. First, verify that a language server exists for the language you want to use.
2. Next, find (or create) a Pulsar package that integrates with that language server.

### Find a language server for your techology stack

The Language Server Project site maintains [a list of known language servers](https://microsoft.github.io/language-server-protocol/implementors/servers/) for various languages and frameworks. Often you’ll see more than one language server on that page for the same language! But it’s typically enough simply to verify that at least one server exists for your language.

### Search the package repository for an IDE package for your language

Packages that integrate with language servers are named according to convention. If you’re looking for an IDE package for a given language, search for `ide-[language]` in the package repository.

Suppose you use a language `foo`. You may find an `ide-foo` package in the repository; this would’ve been written for Atom and may be several years old by now, but may still work to some extent.

Some newer packages exist, however, that are named with `pulsar-` at the front. So if you see one called `pulsar-ide-foo`, install that instead; these tend to be IDE packages written specifically for Pulsar which have a wider set of features.

In some cases, the package might specify the name of the language server rather than the name of the language. One example is `pulsar-ide-clangd`, which is named after [Clangd](https://clangd.llvm.org/), the language server for C/C++.

## I use mainstream, popular languages. Can you just tell me which packages to install?

Let’s make this easy for the vast majority of you:

* JavaScript and [TypeScript](https://www.typescriptlang.org/) authors can install {pulsar-ide-typescript}.
* Authors of CSS (and “enhanced” CSS languages like [Sass](https://sass-lang.com/) and [Less](https://lesscss.org/)) can install {pulsar-ide-css}.
* Those who routinely write JSON can install {pulsar-ide-json}.
* [Python](https://www.python.org/) authors can install {pulsar-ide-python}.
* C/C++ authors can install {pulsar-ide-clangd}.
* [Ruby](https://www.ruby-lang.org/) authors can install {pulsar-ide-ruby-solargraph}.
* [Go](https://go.dev/) authors can install {pulsar-ide-golang}.
* [D](https://dlang.org/) authors can install {pulsar-ide-d}.
* [Markdown](https://www.markdownguide.org/) authors can install {pulsar-ide-markdown}.

Be sure to **read the README of the package you install**. Some of these packages bundle the language server; these tend to be quicker to get up and running. Others require that you install the language server yourself and help the package find its location on your system.


## Why don’t all these packages simply come preinstalled with Pulsar?

Several reasons:

* As mentioned above, they often require external tools and can’t easily be bundled within the package itself. [Clangd](https://clangd.llvm.org/) is a good example: {pulsar-ide-clangd} isn’t going to bundle a tool that has to be compiled for a particular OS and processor architecture. Better for you to download it yourself and tell the package where to find the executable.
* Packages that bundle their own language server _could_ be built into Pulsar, but they’d increase the download and installation size, so we have to be mindful of that trade-off.

Still, it’s possible that some of these packages will be bundled by default in future Pulsar versions.

## What if a language server exists for my language, but a Pulsar package doesn’t?

If you’ve got experience with JavaScript or have read through [our package tutorials](/developing-for-pulsar/), give it a try yourself! We’ve [written a tutorial](../writing-your-own-ide-package/) for exactly this scenario.

The whole point of a language server is to reduce the implementation burden on code editors, since most of the “glue” code is shared across language servers. For that reason, we maintain [a library called `atom-languageclient`](https://github.com/savetheclocktower/atom-languageclient) designed to make it easy to [connect a language server to Pulsar](https://github.com/savetheclocktower/atom-languageclient?tab=readme-ov-file#developing-packages). With practice, you can do it in about a half-hour!

If you’re not comfortable writing JavaScript, [reach out to us](https://pulsar-edit.dev/community) instead. Creating an IDE package for Pulsar is easier than you think! We can often coach you through the process, or perhaps even write it for you.
