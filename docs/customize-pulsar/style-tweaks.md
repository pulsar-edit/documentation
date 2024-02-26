---
title: Style Tweaks
layout: doc.ejs
---

If you want to apply quick-and-dirty personal styling changes without creating
an entire theme that you intend to publish, you can add styles to the
`styles.less` file in your
**_LNX/MAC_**: `~/.pulsar` - **_WIN_**: `%USERPROFILE%\.pulsar`
directory. You can open this file in an editor from the
**_LNX_**: _Edit > Stylesheet_ -
**_MAC_**: _Pulsar > Stylesheet_ -
**_WIN_**: _File > Stylesheet_
menu.

For example, to change the colors of the Status Bar, you could add the following
rule to your `styles.less` file:

```css
.status-bar {
	color: white;
	background-color: black;
}
```

The easiest way to see what classes are available to style is to inspect the DOM
manually via the Developer Tools. To go over the Developer Tools in great detail [refer to it's documentation](), but for now let's take a simple look. You can open
the Developer Tools by pressing
**_LNX/WIN_**: <kbd>Ctrl+Shift+I</kbd> -
**_MAC_**: <kbd>Alt+Cmd+I</kbd>, which will bring up the Chromium Developer Tools
panel.

![Developer Tools](/img/atom/devtools.png "Developer Tools")

With the Developer Tools, you can inspect all the elements in Pulsar. If you
want to update the style of something, you can figure out what classes it has
and add a Less rule to your stylesheet to modify it.

::: tip Tip

If you are unfamiliar with Less, it is a basic CSS preprocessor that makes some
things in CSS a bit easier. You can learn more about it at [lesscss.org](http://www.lesscss.org).

If you prefer to use CSS instead, you can do that in the same `styles.less`
file, since CSS is also valid in Less.

:::
