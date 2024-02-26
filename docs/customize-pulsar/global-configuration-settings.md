---
title: Global Configuration Settings
layout: doc.ejs
---

Pulsar loads configuration settings from the `config.cson` file in your
**_LNX/MAC_**: `~/.pulsar` -
**_WIN_**: `%USERPROFILE%\.pulsar` directory.

```coffee
'*':
  'core':
    'excludeVcsIgnoredPaths': true
  'editor':
    'fontSize': 18
```

The configuration is grouped into global settings under the `*` key and
language-specific settings under scope named keys like `.python.source` or
`.html.text`. Underneath that, you'll find configuration settings grouped by
package name or one of the two core namespaces: `core` or `editor`.

You can open this file in an editor from the
**_LNX_**: _Edit > Config_ -
**_MAC_**: _Pulsar > Config_ -
**_WIN_**: _File > Config_ menu.

## Configuration Key Reference

- `core`
  - `customFileTypes`: Associations of language scope to file extensions (see [Customizing Language Recognition](#customizing-language-recognition))
  - `disabledPackages`: An array of package names to disable
  - `excludeVcsIgnoredPaths`: Don't search within files specified by `.gitignore`
  - `ignoredNames`: File names to ignore across all of Pulsar
  - `projectHome`: The directory where projects are assumed to be located
  - `themes`: An array of theme names to load, in cascading order
- `editor`
  - `autoIndent`: Enable/disable basic auto-indent (defaults to `true`)
  - `nonWordCharacters`: A string of non-word characters to define word
    boundaries
  - `fontSize`: The editor font size
  - `fontFamily`: The editor font family
  - `invisibles`: A hash of characters Pulsar will use to render whitespace
    characters. Keys are whitespace character types, values are
    rendered characters (use value `false` to turn off individual
    whitespace character types)
    - `tab`: Hard tab characters
    - `cr`: Carriage return (for Microsoft-style line endings)
    - `eol`: `\n` characters
    - `space`: Leading and trailing space characters
  - `lineHeight`: Height of editor lines, as a multiplier of font size
  - `preferredLineLength`: Identifies the length of a line (defaults to `80`)
  - `showInvisibles`: Whether to render placeholders for invisible characters
    (defaults to `false`)
  - `showIndentGuide`: Show/hide indent indicators within the editor
  - `showLineNumbers`: Show/hide line numbers within the gutter
  - `softWrap`: Enable/disable soft wrapping of text within the editor
  - `softWrapAtPreferredLineLength`: Enable/disable soft line wrapping at
    `preferredLineLength`
  - `tabLength`: Number of spaces within a tab (defaults to `2`)
- `fuzzyFinder`
  - `ignoredNames`: Files to ignore _only_ in the fuzzy-finder
- `whitespace`
  - `ensureSingleTrailingNewline`: Whether to reduce multiple newlines to one at
    the end of files
  - `removeTrailingWhitespace`: Enable/disable stripping of whitespace at the
    end of lines (defaults to `true`)
- `wrap-guide`
  - `columns`: Array of hashes with a `pattern` and `column` key to match the
    path of the current editor to a column position.
