---
title: Customizing Keybindings
layout: doc.ejs
---

Pulsar keymaps work similarly to stylesheets. Just as stylesheets use selectors
to apply styles to elements, Pulsar keymaps use selectors to associate key
combinations with events in specific contexts. Here's a small example, excerpted
from Pulsar's built-in keymap:

```coffee
'atom-text-editor':
  'enter': 'editor:newline'

'atom-text-editor[mini] input':
  'enter': 'core:confirm'
```

This keymap defines the meaning of [[Enter]] in two different contexts.
In a normal editor, pressing [[Enter]] triggers the `editor:newline`
command, which causes the editor to insert a newline. But if the same keystroke
occurs inside a select list's mini-editor, it instead triggers the
`core:confirm` command based on the binding in the more-specific selector.

By default, `keymap.cson` is loaded when Pulsar is started. It will always be
loaded last, giving you the chance to override bindings that are defined by
Pulsar's core keymaps or third-party packages. You can open this file in an
editor from the
**_LNX_**: _Edit > Keymap_ -
**_MAC_**: _Pulsar > Keymap_ -
**_WIN_**: _File > Keymap_ menu.

You can see all the keybindings that are currently configured in your
installation of Pulsar in the Keybindings tab in the Settings View.

If you run into problems with keybindings, the Keybinding Resolver is a huge
help. It can be opened with the **_LNX/WIN_**: [[Ctrl+.]] -
**_MAC_**: [[Cmd+.]] key combination. It will show you what keys Pulsar
saw you press and what command Pulsar executed because of that combination.
