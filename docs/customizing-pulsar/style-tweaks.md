---
title: Style tweaks
layout: doc.ejs
---

If you want to apply quick-and-dirty personal styling changes without creating an entire theme that you intend to publish, you can add styles to the `styles.less` file in your <span class="platform-linux platform-mac">`~/.pulsar`</span><span class="platform-win">`%USERPROFILE%\.pulsar`</span> directory. You can open this file in an editor from the <span class="platform-linux">_Edit > Stylesheet_</span><span class="platform-mac">_Pulsar > Stylesheet…_</span><span class="platform-win">_File > Stylesheet_</span> menu.


::: tip Tip
[Less](https://lesscss.org) is a basic CSS preprocessor that offers some useful features like variables, functions, and mixins. You can read more about its features in [this in-depth guide](https://lesscss.org/features/).

If you prefer to use CSS instead, you’re in luck: all CSS syntax is valid in a Less stylesheet. Write it as you ordinarily would.
:::


For example, to change the colors of the Status Bar, you could add the following rule to your `styles.less` file:

```css
.status-bar {
	color: white;
	background-color: black;
}
```

## Using developer tools to discover class names

The easiest way to see what classes are available to style is to inspect the DOM manually via the Developer Tools. To go over the Developer Tools in great detail, [refer to its documentation](/debugging-pulsar/check-for-errors-in-developer-tools/), but for now let's take a quick look. You can open the Developer Tools by pressing <kbd class="platform-linux platform-win">Ctrl+Shift+I</kbd> <kbd class="platform-mac">Alt+Cmd+I</kbd>, which will bring up the Chromium Developer Tools panel.

![Developer Tools](/img/atom/devtools-inspect-element.png "Developer Tools")

With the Developer Tools, you can inspect all the elements in Pulsar. If you want to update the style of something, you can figure out what classes it has and add a Less rule to your stylesheet to modify it.

## Advanced customization with variables

[Syntax and UI themes in Pulsar](/developing-for-pulsar/developing-a-theme/) define variables that can be used by other stylesheets in Pulsar — including your user stylesheet.

Suppose you want to customize the color of a variable in Python. You can use the developer tools to inspect a Python variable to discover the right selector to use for customizing its appearance; then you can use a variable in your user stylesheet as follows:

```less
@import 'syntax-variables';

.syntax--source.syntax--python {
  .syntax--variable {
		// You could make it plain…
	  color: @syntax-text-color !important;
		// …or color it like a string…
		color: @syntax-color-string !important;
		// …or like a keyword…
		color: @syntax-color-keyword !important;
		// …or something else.
		// (`!important` may or may not be necessary here, depending on how your
		// syntax theme defines its rules.)
	}
}
```

If we hard-coded a color value here, we’d probably want to change the value if we switched syntax themes in the future. Instead, we can use one of the variables that syntax themes must define; that way the rule will work no matter which syntax theme is active.

Here’s [the full list of syntax variables](https://github.com/pulsar-edit/pulsar/blob/master/static/variables/syntax-variables.less) you can rely on.

There is a similar set of variables you can use when customizing the UI:

```less
@import 'ui-variables';

// When a file has unsaved changes, make the tab text yellow.
li.tab.modified {
  color: @text-color-warning;
}
```

Here’s [the full set of UI variables](https://github.com/pulsar-edit/pulsar/blob/master/static/variables/ui-variables.less) you can rely on.
