---
title: Grammar
layout: doc.ejs
---

The “grammar” of a file is the language that Pulsar has associated with that file. Examples of grammars include “Java,” “Python,” and “GitHub-Flavored Markdown.”

When you load a file, Pulsar tries to figure out the best grammar to use for that file. It uses a number of techniques to pick a grammar, though usually the first technique is sufficient:

* Inspecting the file extension. (`.md` usually means a Markdown file, for example.)
* Inspecting the first line of the file. (Shell scrips and other files without extensions can sometimes indicate their language via metadata on the first line.)
* Inspecting the contents of the file. (When two different languages use the same file extension — like C and C++, in some unusual cases — the file contents themselves will give us hints about which language is being used.)

When Pulsar can’t even make a guess at the right grammar, it will default to “Plain Text,” which is the simplest one. If it does default to
“Plain Text” or picks the wrong grammar for the file — or if, for any reason, you wish to change the selected grammar — you can pull up the Grammar Selector with [[Ctrl+Shift+L]].

![Grammar Selector](/img/atom/grammar.png "Grammar Selector")

When the grammar of a file is changed, Atom will remember that change for the current session.

The Grammar Selector functionality is implemented in the {grammar-selector} package.
