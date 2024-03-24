---
title: Snippets
layout: doc.ejs
---

Snippets are an incredibly powerful way to quickly generate commonly needed code syntax from a shortcut.

The idea is that you can type something like `habtm` and then press the [[Tab]] key and it will expand into `has_and_belongs_to_many`. You can also invoke a snippet by choosing it from an Autocomplete menu or by assigning it its own command.

Many Core and Community packages come bundled with their own package-specific snippets. For example, the `language-html` package that provides support for HTML syntax highlighting and grammar comes with dozens of snippets to create many of the various HTML tags you might want to use. If you create a new HTML file in Pulsar, you can type `html` and then press [[Tab]] and it will expand to:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
	<head>
		<meta charset="utf-8" />
		<title></title>
	</head>
	<body></body>
</html>
```

It will also position the cursor in the `lang` attribute value so you can edit
it if necessary.

Many snippets have multiple focus points that you can move through with the [[Tab]] key. For instance, in the case of this HTML snippet, after the cursor is placed in the `lang` attribute value, you can continue pressing [[Tab]] and the cursor will move to the `dir` attribute value, then to the middle of the `title` tag, then finally to the middle of the `body` tag.

To see all the available snippets for the file type that you currently have open, choose "Snippets: Available" in the Command Palette.

![View all available snippets](/img/atom/snippets.png "View all available snippets")

You can also use fuzzy search to filter this list down by typing in the selection box. Selecting one of them will execute the snippet where your cursor is (or multiple cursors are).

## Snippets for Prose

There are also a number of great snippets available for writing Markdown quickly.

If you type `img` and hit [[Tab]] you get a Markdown-formatted image embed code like `![]()`. If you type `table` and hit [[Tab]] you get a nice example table to fill out.

```markdown
| Header One | Header Two |
| :--------- | :--------- |
| Item One   | Item Two   |
```

Although there are only a handful of Markdown snippets (`b` for bold, `i` for italic, `code` for a code block, etc), they save you from having to look up the more obscure syntaxes. Again, you can easily see a list of all available snippets for the type of file you're currently in by choosing `Snippets: Available` in the Command Palette.

## Creating Your Own Snippets

So that's pretty cool, but what if there is something the language package didn't include or something that is custom to the code your write? Luckily it's [incredibly easy to add your own snippets](/customize-pulsar/creating-your-own-snippets).
