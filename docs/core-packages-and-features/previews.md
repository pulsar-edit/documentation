---
title: Previews
layout: doc.ejs
---

When writing prose in a markup language, it's often very useful to get an idea
of what the content will look like when it's rendered. Pulsar ships with a
package for previewing Markdown by default.

- [[Ctrl+Shift+M]] - Will toggle Preview mode for Markdown.

![Preview your prose](/img/atom/preview.png)

As you edit the text, the preview will also update automatically. This makes it
fairly easy to check your syntax as you type.

You can also copy the rendered HTML from the preview pane into your system
clipboard when the preview is focused and you press
**_LNX_**: [[Ctrl+Ins]] -
**_WIN_**: [[Ctrl+C]] -
**_MAC_**: [[Cmd+C]] or if you right-click in the preview
pane and choose "Copy as HTML".

Markdown preview is implemented in the [markdown-preview](https://github.com/pulsar-edit/pulsar/tree/HEAD/packages/markdown-preview)
package.
