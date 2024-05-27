---
title: Style tweaks
layout: doc.ejs
---

If you want to apply quick-and-dirty personal styling changes without creating an entire theme that you intend to publish, you can add styles to the `styles.less` file in your <span class="platform-linux platform-mac">`~/.pulsar`</span><span class="platform-win">`%USERPROFILE%\.pulsar`</span> directory. You can open this file in an editor from the <span class="platform-linux">_Edit > Stylesheet_</span><span class="platform-mac">_Pulsar > Stylesheet…_</span><span class="platform-win">_File > Stylesheet_</span> menu.

For example, to change the colors of the Status Bar, you could add the following rule to your `styles.less` file:

```css
.status-bar {
	color: white;
	background-color: black;
}
```

The easiest way to see what classes are available to style is to inspect the DOM manually via the Developer Tools. To go over the Developer Tools in great detail, [refer to its documentation](/debugging-pulsar/check-for-errors-in-developer-tools/), but for now let's take a quick look. You can open the Developer Tools by pressing <kbd class="platform-linux platform-win">Ctrl+Shift+I</kbd> <kbd class="platform-mac">Alt+Cmd+I</kbd>, which will bring up the Chromium Developer Tools panel.

![Developer Tools](/img/atom/devtools.png "Developer Tools")

With the Developer Tools, you can inspect all the elements in Pulsar. If you want to update the style of something, you can figure out what classes it has and add a Less rule to your stylesheet to modify it.

::: tip Tip
[Less](https://lesscss.org) is a basic CSS preprocessor that offers some useful features like variables, functions, and mixins. You can read more about its features in [this in-depth guide](https://lesscss.org/features/).

If you prefer to use CSS instead, you’re in luck: all CSS syntax is valid in a Less stylesheet. Write it as you ordinarily would.
:::
