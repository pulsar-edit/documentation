---
title: Find and Replace
layout: doc.ejs
---

Finding and replacing text in your file or project is quick and easy in Pulsar.

::: info Shortcuts

- <kbd class="platform-linux platform-win">Ctrl+F</kbd> <kbd class="platform-mac">Cmd+F</kbd> - Search within a buffer
- <kbd class="platform-linux platform-win">Ctrl+Shift+F</kbd> <kbd class="platform-mac">Cmd-Shift-F</kbd> - Search the entire project

:::

If you launch either of those commands, you’ll be greeted with the Find and
Replace panel at the bottom of your screen.

![Find and replace text in the current file](/img/atom/find-replace-file.png "Find and replace text in the current file")

To search within your current file, you can press <kbd class="platform-linux platform-win">Ctrl+F</kbd><kbd class="platform-mac">Cmd+F</kbd>, type in a search string and press <span class="platform-linux platform-win"><kbd>Enter</kbd> or <kbd>F3</kbd></span><span class="platform-mac"><kbd>Enter</kbd> or <kbd>Cmd+G</kbd></span> (or the **Find Next** button) multiple times to cycle through all the matches in that file. [[Alt+Enter]] will find all occurrences of the search string. The Find and Replace panel also contains buttons for toggling case sensitivity, performing regular expression matching, scoping the search to selections, and performing whole word search.

If you type a string in the replacement text box, you can replace matches with a different string. For example, if you wanted to replace every instance of the string "Atom" with the string "Pulsar", you would enter those values in the two text boxes and press the "Replace All" button to perform the replacements.

::: note Note

**Note:** Pulsar uses JavaScript regular expressions to perform regular expression searches.

When doing a regular expression search, the replacement syntax to refer back to search groups is `$1`, `$2`, … `$&`. Refer to JavaScript’s [guide to regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) to learn more about regular expression syntax you can use in Pulsar.

:::

You can also find and replace throughout your entire project if you invoke the panel with <kbd class="platform-linux platform-win">Ctrl+Shift+F</kbd><kbd class="platform-mac">Cmd+Shift+F</kbd>.

![Find and replace text in your project](/img/atom/find-replace-project.png "Find and replace text in your project")

This is a great way to find out where in your project a function is called, an anchor is linked to or a specific misspelling is located. Click on the matching line to jump to that location in that file.

You can limit a search to a subset of the files in your project by entering a [glob pattern](https://en.wikipedia.org/wiki/Glob_%28programming%29) into the "File/Directory pattern" text box. For example, the pattern `src/*.js` would restrict the search to JavaScript files in the `src` directory. The “globstar” pattern (`**`) can be used to match arbitrarily many subdirectories. For example, `docs/**/*.md` will match `docs/a/foo.md`, `docs/a/b/foo.md`, etc. You can enter multiple glob patterns separated by commas, which is useful for searching in multiple file types or subdirectories.

When you have multiple project folders open, this feature can also be used to search in only one of those folders. For example, if you had the folders `/path1/folder1` and `/path2/folder2` open, you could enter a pattern starting with `folder1` to search only in the first folder.

Press [[Esc]] while focused on the Find and Replace panel to clear the pane from your workspace.

Find-and-replace functionality is implemented in the {find-and-replace} package and uses the [scandal](https://github.com/pulsar-edit/scandal) Node module to do the actual searching.
