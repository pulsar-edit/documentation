---
title: Customizing keybindings
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

By default, `keymap.cson` is loaded when Pulsar is started. It will always be loaded last, giving you the chance to override bindings that are defined by Pulsar's core keymaps or third-party packages. You can open this file in an editor from the <span class="platform-linux">_Edit > Keymap_</span><span class="platform-mac">_Pulsar > Keymap…_</span><span class="platform-win">_File > Keymap_</span> menu item.

You can see all the keybindings that are currently configured in your installation of Pulsar in the Keybindings tab in the Settings View.

If you run into problems with keybindings, the Keybinding Resolver is a huge help. It can be opened with the <kbd class="platform-linux platform-win">Ctrl+.</kbd> <kbd class="platform-mac">Cmd+.</kbd> key combination. It will show you what keys Pulsar saw you press and what command Pulsar executed because of that combination.
