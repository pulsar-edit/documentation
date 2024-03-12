---
title: Language Specific Configuration Settings
layout: doc.ejs
---

You can also set several configuration settings differently for different file
types. For example, you may want Pulsar to soft wrap markdown files, have
two-space tabs for ruby files, and four-space tabs for python files.

There are several settings now scoped to an editor's language. Here is the
current list:

```
editor.autoIndent
editor.autoIndentOnPaste
editor.invisibles
editor.nonWordCharacters
editor.preferredLineLength
editor.scrollPastEnd
editor.showIndentGuide
editor.showInvisibles
editor.softWrap
editor.softWrapAtPreferredLineLength
editor.softWrapHangingIndent
editor.tabLength
```

## Language-specific Settings in the Settings View

You can edit these config settings in the Settings View on a per-language basis.
Click on "Packages" tab in the navigation bar on the left, search for the
language of your choice, select it, and edit away!

![Python-specific settings](/img/atom/python-settings.png "Python-specific settings")

## Language-specific Settings in your Config File

You can also edit the `config.cson` directly. To open your configuration file
via the Command Palette, press
**_LNX/WIN_**: [[Ctrl+Shift+P]] -
**_MAC_**: [[Cmd+Shift+P]] type `open config`,
and press [[Enter]].

Global settings are under the `*` key, and each language can have its own
top-level key. This key is the language's scope. Language-specific settings
take precedence over anything set in the global section for that language only.

```coffee
'*': # all languages unless overridden
  'editor':
    'softWrap': false
    'tabLength': 8

'.source.gfm': # markdown overrides
  'editor':
    'softWrap': true

'.source.ruby': # ruby overrides
  'editor':
    'tabLength': 2

'.source.python': # python overrides
  'editor':
    'tabLength': 4
```

## Finding a Language's Scope Name

In order to write these overrides effectively, you'll need to know the scope
name for the language. We've already done this for finding a scope for writing a
snippet in [Snippet Format](/customize-pulsar/creating-your-own-snippets/#snippet-format), but we can quickly cover it
again.

The scope name is shown in the settings view for each language. Click on
"Packages" in the navigation on the left, search for the language of your
choice, select it, and you should see the scope name under the language name
heading:

![Finding a language grammar](/img/atom/python-grammar.png "Finding a grammar's scope name")

Another way to find the scope for a specific language is to open a file of its
kind and:

- **_LNX/WIN_**: Choose "Editor: Log Cursor Scope" in the Command Palette
- **_MAC_**: Press [[Alt+Cmd+P]]
  to show all scopes for the current position of the cursor. The scope mentioned
  top most is always the language for this kind of file, the scopes following are
  specific to the cursor position:

![Finding a language grammar with cursor scope](/img/atom/cursor-scope.png "Finding a language grammar with cursor scope")

These scopes can be especially useful to style the editor, since they can also
be used as class names in your stylesheet.
