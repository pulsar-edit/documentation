---
title: Editing and Deleting Text
layout: doc.ejs
---

So far we've looked at a number of ways to move around and select regions of a
file, so now let's actually change some of that text. Obviously you can type in
order to insert characters, but there are also a number of ways to delete and
manipulate text that could come in handy.

## Basic Manipulation

There are a handful of cool keybindings for basic text manipulation that might
come in handy. These range from moving around lines of text and duplicating
lines to changing the case.

::: tabs#using-pulsar

@tab Linux

- [[Ctrl+J]] - Join the next line to the end of the current line
- [[Ctrl+Up/Down]] - Move the current line up or down
- [[Ctrl+Shift+D]] - Duplicate the current line
- [[Ctrl+K]] [[Ctrl+U]] - Upper case the current word
- [[Ctrl+K]] [[Ctrl+L]] - Lower case the current word

@tab macOS

- [[Cmd+J]] - Join the next line to the end of the current line
- [[Cmd+Ctrl+Up/Down]] - Move the current line up or down
- [[Cmd+Shift+D]] - Duplicate the current line
- [[Cmd+K]] [[Cmd+U]] - Upper case the current word
- [[Cmd+K]] [[Cmd+L]] - Lower case the current word
- [[Ctrl+T]] - Transpose characters. This swaps the two characters on either side of the cursor.

@tab Windows

- [[Ctrl+J]] - Join the next line to the end of the current line
- [[Ctrl+Up/Down]] - Move the current line up or down
- [[Ctrl+Shift+D]] - Duplicate the current line
- [[Ctrl+K]] [[Ctrl+U]] - Upper case the current word
- [[Ctrl+K]] [[Ctrl+L]] - Lower case the current word

:::

Pulsar also has built in functionality to re-flow a paragraph to hard-wrap at a given maximum line length. You can format the current selection to have lines no longer than 80 (or whatever number `editor.preferredLineLength` is set to) characters using <kbd class="platform-linux platform-win">Ctrl+Shift+Q</kbd> <kbd class="platform-mac">Alt+Cmd+Q</kbd>. If nothing is selected, the current paragraph will be reflowed.

## Deleting and Cutting

You can also delete or cut text out of your buffer with some shortcuts.
Be ruthless.

::: tabs#using-pulsar

@tab Linux

- [[Ctrl+Shift+K]] - Delete current line
- [[Ctrl+Backspace]] - Delete to beginning of word
- [[Ctrl+Delete]] - Delete to end of word

@tab macOS

- [[Ctrl+Shift+K]] - Delete current line
- [[Alt+Backspace]] or [[Alt+H]] - Delete to beginning of word
- [[Alt+Delete]] or [[Alt+D]] - Delete to end of word
- [[Cmd+Delete]] - Delete to end of line
- [[Ctrl+K]] - Cut to end of line
- [[Cmd+Backspace]] - Delete to beginning of line

@tab Windows

- [[Ctrl+Shift+K]] - Delete current line
- [[Ctrl+Backspace]] - Delete to beginning of word
- [[Ctrl+Delete]] - Delete to end of word

:::

## Multiple Cursors and Selections

One of the cool things that Pulsar can do out of the box is support multiple
cursors. This can be incredibly helpful in manipulating long lists of text.

::: tabs#using-pulsar

@tab Linux

- [[Ctrl+Click]] - Add a new cursor at the clicked location
- [[Alt+Shift+Up/Down]] - Add another cursor above/below the current
  cursor
- [[Ctrl+D]] - Select the next word in the document that is the same as
  the currently selected word
- [[Alt+F3]] - Select all words in the document that are the same as the
  currently selected word

@tab macOS

- [[Cmd+Click]] - Add a new cursor at the clicked location
- [[Ctrl+Shift+Up/Down]] - Add another cursor above/below the current
  cursor
- [[Cmd+D]] - Select the next word in the document that is the same as
  the currently selected word
- [[Cmd+Ctrl+G]] - Select all words in the document that are the same as
  the currently selected word
- [[Cmd+Shift+L]] - Convert a multi-line selection into multiple cursors

@tab Windows

- [[Ctrl+Click]] - Add a new cursor at the clicked location
- [[Alt+Ctrl+Up/Down]] - Add another cursor above/below the current
  cursor
- [[Ctrl+D]] - Select the next word in the document that is the same as
  the currently selected word
- [[Alt+F3]] - Select all words in the document that are the same as the
  currently selected word

:::

Using these commands you can place cursors in multiple places in your document
and effectively execute the same commands in multiple places at once.

![Using multiple cursors](/img/atom/multiple-cursors.gif)

This can be incredibly helpful in doing many type of repetitive tasks such as
renaming variables or changing the format of some text. You can use this with
almost any package or command - for example, changing case and moving or
duplicating lines.

You can also use the mouse to select text with the <kbd class="platform-linux platform-win">Ctrl</kbd> <kbd class="platform-mac">Cmd</kbd> key pressed down to select multiple regions of your text simultaneously.

Return to a single cursor with [[Esc]] or by clicking anywhere in the file to position a cursor there as normal.

## Whitespace

Pulsar comes with several commands to help you manage the whitespace in your
document. One very useful pair of commands converts leading spaces into tabs and
converts leading tabs into spaces. If you're working with a document that has
mixed whitespace, these commands are great for helping to normalize the file.
There are no keybindings for the whitespace commands, so you will have to search
your command palette for "Convert Spaces to Tabs" (or vice versa) to run one of
these commands.

The whitespace commands are implemented in the {whitespace}
package. The settings for the whitespace commands are managed on the page for
the `whitespace` package.

![Managing your whitespace settings](/img/atom/whitespace.png)

::: note Note

The "Remove Trailing Whitespace" option is on by default. This means that every
time you save any file opened in Pulsar, it will strip all trailing whitespace
from the file. If you want to disable this, go to the `whitespace` package in
your settings panel and uncheck that option.

:::

Pulsar will also by default ensure that your file has a trailing newline. You
can also disable this option on that screen.

## Brackets

Pulsar ships with intelligent and easy to use bracket handling.

It will by default highlight `[]`, `()`, and `{}` style brackets when your
cursor is over them. It will also highlight matching XML and HTML tags.

Pulsar will also automatically autocomplete `[]`, `()`, and `{}`, `""`, `''`,
`“”`, `‘’`, `«»`, `‹›`, and ` `` ` when you type the leading one. If you have
a selection and you type any of these opening brackets or quotes, Pulsar will
enclose the selection with the opening and closing brackets or quotes.

There are a few other interesting bracket related commands that you can use.

::: tabs#using-pulsar

@tab Linux

- [[Ctrl+M]] - Jump to the bracket matching the one adjacent to the cursor.
  It jumps to the nearest enclosing bracket when there's no adjacent bracket.
- [[Alt+Ctrl+,]] - Select all the text inside the current brackets
- [[Alt+Ctrl+.]] - Close the current XML/HTML tag

@tab macOS

- [[Ctrl+M]] - Jump to the bracket matching the one adjacent to the cursor.
  It jumps to the nearest enclosing bracket when there's no adjacent bracket.
- [[Cmd+Ctrl+M]] - Select all the text inside the current brackets
- [[Alt+Cmd+.]] - Close the current XML/HTML tag

@tab Windows

- [[Ctrl+M]] - Jump to the bracket matching the one adjacent to the cursor.
  It jumps to the nearest enclosing bracket when there's no adjacent bracket.
- [[Alt+Ctrl+,]] - Select all the text inside the current brackets
- [[Alt+Ctrl+.]] - Close the current XML/HTML tag

:::

The brackets functionality is implemented in the {bracket-matcher}
package. Like all of these packages, to change defaults related to bracket
handling, or to disable it entirely, you can navigate to this package in the
Settings view.

## Encoding

Pulsar also ships with some basic file encoding support should you find yourself
working with non-UTF-8 encoded files, or should you wish to create one.

::: tabs#using-pulsar

@tab Linux

[[Alt+U]] - Toggle menu to change file encoding

@tab macOS

[[Ctrl+Shift+U]] - Toggle menu to change file encoding

@tab Windows

[[Ctrl+Shift+U]] - Toggle menu to change file encoding

:::

If you pull up the file encoding dialog, you can choose an alternate file
encoding to save your file in.

When you open a file, Pulsar will try to auto-detect the encoding. If Pulsar
can't identify the encoding, the encoding will default to UTF-8, which is also
the default encoding for new files.

![Changing your file encoding](/img/atom/encodings.png)

If you pull up the encoding menu and change the active encoding to something
else, the file will be written out in that encoding the next time you save the
file.

The encoding selector is implemented in the {encoding-selector}
package.
