---
title: Moving in Pulsar
layout: doc.ejs
---

While it's pretty easy to move around Pulsar by clicking with the mouse or using
the arrow keys, there are some keybindings that may help you keep your hands on
the keyboard and navigate around a little faster.

:::tabs#using-pulsar

@tab Linux

Pulsar has support for all the standard Linux cursor movement key combinations.
To go up, down, left or right a single character you can use the arrow keys.

In addition to single character movement, there are a number of other movement
keybindings:

- [[Ctrl+Left]] - Move to the beginning of word
- [[Ctrl+Right]] - Move to the end of word
- [[Home]] - Move to the first character of the current line
- [[End]] - Move to the end of the line
- [[Ctrl+Home]] - Move to the top of the file
- [[Ctrl+End]] - Move to the bottom of the file

@tab macOS

Pulsar ships with many of the basic Emacs keybindings for navigating a document.
To go up and down a single character, you can use [[Ctrl+P]] and
[[Ctrl+N]]. To go left and right a single character, you can use
[[Ctrl+B]] and [[Ctrl+F]]. These are the equivalent of using the
arrow keys, though some people prefer not having to move their hands to where
the arrow keys are located on their keyboard.

In addition to single character movement, there are a number of other movement
keybindings:

- [[Alt+Left]] or [[Alt+B]] - Move to the beginning of word
- [[Alt+Right]] or [[Alt+F]] - Move to the end of word
- [[Cmd+Left]] or [[Ctrl+A]] - Move to the first character of the current line
- [[Cmd+Right]] or [[Ctrl+E]] - Move to the end of the line
- [[Cmd+Up]] - Move to the top of the file
- [[Cmd+Down]] - Move to the bottom of the file

@tab Windows

Pulsar has support for all the standard Windows cursor movement key combinations.
To go up, down, left or right a single character you can use the arrow keys.

In addition to single character movement, there are a number of other movement
keybindings:

- [[Ctrl+Left]] - Move to the beginning of word
- [[Ctrl+Right]] - Move to the end of word
- [[Home]] - Move to the first character of the current line
- [[End]] - Move to the end of the line
- [[Ctrl+Home]] - Move to the top of the file
- [[Ctrl+End]] - Move to the bottom of the file

:::

You can also move directly to a specific line (and column) number with
[[Ctrl+G]]. This will bring up a dialog that asks which line you would
like to jump to. You can also use the `row:column` syntax to jump to a character
in that line as well.

![Go directly to a line](/img/atom/goto.png "Go directly to a line")

### Additional Movement and Selection Commands

Pulsar also has a few movement and selection commands that don't have
keybindings by default. You can access these commands from the [Command Palette](/using-pulsar/pulsar-basics/#command-palette),
but if you find yourself using commands that don't have a keybinding often, have
no fear! You can easily add an entry to your `keymap.cson` to create a key
combination. You can open `keymap.cson` file in an editor from the
**_LNX_**: _Edit > Keymap_ -
**_MAC_**: _Pulsar > Keymap_ -
**_WIN_**: _File > Keymap_ menu.
For example, the command `editor:move-to-beginning-of-screen-line` is available
in the command palette, but it's not bound to any key combination. To create a
key combination you need to add an entry in your `keymap.cson` file. For
`editor:select-to-previous-word-boundary`, you can add the following to your
`keymap.cson`:

::: tabs#using-pulsar <!--TODO: Check if these are rebranded in core-->

@tab Linux

```coffee
'atom-text-editor':
  'ctrl-shift-e': 'editor:select-to-previous-word-boundary'
```

@tab macOS

```coffee
'atom-text-editor':
  'cmd-shift-e': 'editor:select-to-previous-word-boundary'
```

@tab Windows

```coffee
'atom-text-editor':
  'ctrl-shift-e': 'editor:select-to-previous-word-boundary'
```

:::

This will bind the command `editor:select-to-previous-word-boundary` to
**_LNX/WIN_**: [[Ctrl+Shift+E]] -
**_MAC_**: [[Cmd+Shift+E]]. For more information on
customizing your keybindings, see [Customizing Keybindings](/customize-pulsar/customizing-keybindings/).

Here's a list of Movement and Selection Commands that do not have a keyboard
shortcut by default:

::: tabs#using-pulsar

@tab Linux

```
editor:move-to-beginning-of-next-paragraph
editor:move-to-beginning-of-previous-paragraph
editor:move-to-beginning-of-screen-line
editor:move-to-beginning-of-line
editor:move-to-end-of-line
editor:move-to-first-character-of-line
editor:move-to-beginning-of-next-word
editor:move-to-previous-word-boundary
editor:move-to-next-word-boundary
editor:select-to-beginning-of-next-paragraph
editor:select-to-beginning-of-previous-paragraph
editor:select-to-end-of-line
editor:select-to-beginning-of-line
editor:select-to-beginning-of-next-word
editor:select-to-next-word-boundary
editor:select-to-previous-word-boundary
```

@tab macOS

```
editor:move-to-beginning-of-next-paragraph
editor:move-to-beginning-of-previous-paragraph
editor:move-to-beginning-of-screen-line
editor:move-to-beginning-of-line
editor:move-to-beginning-of-next-word
editor:move-to-previous-word-boundary
editor:move-to-next-word-boundary
editor:select-to-beginning-of-next-paragraph
editor:select-to-beginning-of-previous-paragraph
editor:select-to-beginning-of-line
editor:select-to-beginning-of-next-word
editor:select-to-next-word-boundary
editor:select-to-previous-word-boundary
```

@tab Windows

```
editor:move-to-beginning-of-next-paragraph
editor:move-to-beginning-of-previous-paragraph
editor:move-to-beginning-of-screen-line
editor:move-to-beginning-of-line
editor:move-to-end-of-line
editor:move-to-first-character-of-line
editor:move-to-beginning-of-next-word
editor:move-to-previous-word-boundary
editor:move-to-next-word-boundary
editor:select-to-beginning-of-next-paragraph
editor:select-to-beginning-of-previous-paragraph
editor:select-to-end-of-line
editor:select-to-beginning-of-line
editor:select-to-beginning-of-next-word
editor:select-to-next-word-boundary
editor:select-to-previous-word-boundary
```

:::

### Navigating by Symbols

You can also jump around a little more informatively with the Symbols View. To
jump to a symbol such as a method definition, press
**_LNX/WIN_**: [[Ctrl+R]] -
**_MAC_**: [[Cmd+R]]. This opens a list of all symbols in the current file, which
you can fuzzy filter similarly to
**_LNX/WIN_**: [[Ctrl+T]] -
**_MAC_**: [[Cmd+T]].
You can also search for symbols across your project but it requires a `tags`
file.

![Search by symbol across your project](/img/atom/symbol.png)

You can generate a `tags` file by using the [ctags utility](https://ctags.io/).
Once it is installed, you can use it to generate a `tags` file by running a
command to generate it. See the [ctags documentation](https://docs.ctags.io/en/latest/)
for details.

::: tabs#using-pulsar

@tab Linux

Once you have your `tags` file generated, you can use it to search for symbols
across your project by pressing [[Ctrl+Shift+R]]. This also enables you
to use [[Alt+Ctrl+Down]] to go to and [[Alt+Ctrl+Up]] to return
from the declaration of the symbol under the cursor.

@tab macOS

Once you have your `tags` file generated, you can use it to search for symbols
across your project by pressing [[Cmd+Shift+R]]. This also enables you
to use [[Alt+Cmd+Down]] to go to and [[Alt+Cmd+Up]] to return from
the declaration of the symbol under the cursor.

@tab Windows

Once you have your `tags` file generated, you can use it to search for symbols
across your project by pressing <kbd class>Ctrl+Shift+R]].

:::

You can customize how tags are generated by creating your own `.ctags` file in
your home directory,
**_LNX/MAC_**: `~/.ctags` -
**_WIN_**: `%USERPROFILE%\.ctags`.
An example can be found [here](https://github.com/pulsar-edit/pulsar/blob/HEAD/packages/symbol-provider-ctags/lib/ctags-config).

The symbols navigation functionality is implemented in the {symbols-view}
package.

### Bookmarks

Pulsar also has a great way to bookmark specific lines in your project so you can
jump back to them quickly.

If you press
**_LNX/WIN_**: [[Alt+Ctrl+F2]] -
**_MAC_** [[Cmd+F2]], Pulsar will toggle
a "bookmark" on the current line. You can set these throughout your project and
use them to quickly find and jump to important lines of your project. A small
bookmark symbol is added to the line gutter, like on line 22 of the image below.

If you hit [[F2]], Pulsar will jump to the next bookmark in the file you
currently have focused. If you use [[Shift+F2]] it will cycle backwards
through them instead.

You can also see a list of all your project's current bookmarks and quickly
filter them and jump to any of them by hitting [[Ctrl+F2]].

![View and filter bookmarks](/img/atom/bookmarks.png "View and filter bookmarks")

The bookmarks functionality is implemented in the {bookmarks}
package.
