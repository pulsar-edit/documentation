---
title: Spell Check
layout: doc.ejs
---

If you're working in text (which includes plain text files, GitHub markdown, and Git commit messages by default), Pulsar will automatically try to check your spelling.

Any misspelled words will be highlighted (by default with a dashed red line beneath the word), and you can pull up a menu of possible corrections by hitting <kbd class="platform-linux platform-win">Ctrl+Shift+;</kbd> <kbd class="platform-mac">Cmd+Shift+;</kbd>.

![Checking your spelling](/img/atom/spellcheck.png)

To add more types of files to the list of what Pulsar will try to spell check, go to the Spell Check package settings in your Settings view and add any grammars you want to spell check.

The default grammars to spell check are `text.plain`, `source.gfm`, `text.git-commit`, `source.asciidoc`, `source.rst`, and `text.restructuredtext` — but you can add any other grammars for other file types you wish to check.

Spell-checking is implemented in the {spell-check} package.
