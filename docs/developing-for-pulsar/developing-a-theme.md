---
title: Developing a theme
layout: doc.ejs
---

Pulsar's interface is rendered using HTML, and it's styled via [Less](http://lesscss.org/) which is a superset of CSS. Don't worry if you haven't heard of Less before; it's just like CSS, but with a few handy extensions.

Pulsar supports two types of themes: _UI_ and _Syntax_. UI themes style elements such as the tree view, the tabs, drop-down lists, and the status bar. Syntax themes style the code, gutter and other elements inside the editor view.

![Theme boundary](/img/atom/theme-boundary.png)

Themes can be installed and changed from the Settings View which you can open by selecting the <span class="platform-linux">_Edit > Preferences_</span> <span class="platform-mac">_Pulsar > Preferences_</span> <span class="platform-win">_File > Preferences_</span> menu, and clicking the "Install" or "Themes" tab on the left-hand navigation.

## Getting started

Themes are pretty straightforward, but it’s still helpful to be familiar with a few things before starting:

- Less is a superset of CSS, but it has some really handy features like
  variables. If you aren't familiar with its syntax, take a few minutes to
  [familiarize yourself](https://speakerdeck.com/danmatthews/less-css).
- You may also want to review the concept of a `package.json` (as covered in
  [Pulsar `package.json`](../developing-a-package/#package.json)). This file is used to help distribute your theme to Pulsar users.
- Your theme's `package.json` must contain a `theme` key with a value of `ui`
  or `syntax` for Pulsar to recognize and load it as a theme.
- You can find existing themes to install or fork in
  [Pulsar Package Repository](https://web.pulsar-edit.dev/packages). <!--TODO: Update to a themes URL if we get one on the front end site-->

## Creating a syntax theme

Let's create your first theme.

To get started, press <kbd class="platform-linux platform-win">Ctrl+Shift+P</kbd> <kbd class="platform-mac">Cmd+Shift+P</kbd> and start typing `Generate Syntax Theme` to generate a new theme package. Select **Package Generator: Generate Syntax Theme**, and you'll be asked for the path where your theme will be created. Let's call ours `motif-syntax`.

::: tip Tip

Syntax themes should end with `-syntax` and UI themes should end with `-ui`.

:::

Pulsar will display a new window, showing the `motif-syntax` theme, with a default set of folders and files created for us. If you open the Settings View with <kbd class="platform-linux platform-win">Ctrl+,</kbd><kbd class="platform-mac">Cmd+,</kbd> and click the **Themes** tab on the left, you'll see the "Motif" theme listed in the "Syntax Theme" drop-down. Select it from the menu to activate it. Now, when you open an editor, you should see your new motif-syntax theme in action.

Open up `styles/colors.less` to change the various color variables which have already been defined. For example, turn `@red` into `#f4c2c1`.

Then open `styles/base.less` and modify the various selectors that have already been defined. These selectors style different parts of code in the editor such as comments, strings and the line numbers in the gutter.

As an example, let's make the `.gutter` `background-color` into `@red`.

Reload Pulsar by pressing <kbd class="platform-linux platform-win">Alt+Ctrl+R</kbd><kbd class="platform-mac">Alt+Ctrl+Cmd+L</kbd> (or running the **Window: Reload** command) to see the changes you made reflected in your Pulsar window. Pretty neat!

::: tip Tip

You can avoid reloading to see changes you make by opening an Pulsar window in Dev Mode. To open a Dev Mode Pulsar window, run `pulsar --dev .` in the terminal or use the _View > Developer > Open in Dev Mode_ menu. When you edit your theme, changes will instantly be reflected!

:::

::: note Note

It's advised to _not_ specify a `font-family` in your syntax theme because it will override the Font Family field in Pulsar's settings. If you still like to recommend a font that goes well with your theme, we suggest you do so in your README.

:::

## Creating a UI theme

To create a UI theme, do the following:

1. Fork the [ui-theme-template](https://github.com/pulsar-edit/ui-theme-template)
2. Clone the forked repository to the local filesystem
3. Open a terminal in the forked theme's directory
4. Open your new theme in a Dev Mode Pulsar window run `pulsar --dev .` in the
   terminal or use the _View > Developer > Open in Dev Mode_ menu
5. Change the name of the theme in the theme's `package.json` file
6. Name your theme end with a `-ui`, for example `super-white-ui`
7. Run `pulsar -p link --dev` to symlink your repository to <span class="platform-linux platform-mac">`~/.pulsar/dev/packages`</span> <span class="platform-win">`%USERPROFILE%\.pulsar`</span>
8. Reload Pulsar using <kbd class="platform-linux platform-win">Alt+Ctrl+R</kbd> <kbd class="platform-mac">Alt+Cmd+Ctrl+L</kbd>
9. Enable the theme via the "UI Theme" drop-down in the "Themes" tab of the
   Settings View
10. Make changes! Since you opened the theme in a Dev Mode window, changes will
    be instantly reflected in the editor without having to reload.

::: tip Tip

Because we used `pulsar -p link --dev` in the above instructions, if you break anything you can always close Pulsar and launch Pulsar normally to force Pulsar to the default theme. This allows you to continue working on your theme even if something goes catastrophically wrong.

:::

## Theme variables

UI themes **must** provide a `ui-variables.less` file; syntax themes **must** provide a `syntax-variables.less` file. These files contain predefined variables that packages use so that useful values can be exposed.

These files in the Pulsar repository define default values for certain variables:

- [ui-variables.less](https://github.com/pulsar-edit/pulsar/blob/master/static/variables/ui-variables.less)
- [syntax-variables.less](https://github.com/pulsar-edit/pulsar/blob/master/static/variables/syntax-variables.less)

These default values will be used as fallbacks in case a theme doesn't define its own variables.

### Use in user customizations

Suppose you want the `async` modifier on JavaScript functions to be colored like a keyword. You could edit your user stylesheet as follows:

```less
@import "syntax-variables";

.syntax--source.syntax--js {
  .syntax--storage.syntax--modifier.syntax--async {
    color: @syntax-color-keyword;
  }
}
```

You don’t have to look up the specific color that your syntax theme uses for keywords! You can use this variable because it’s part of the `syntax-variables.less` contract. And it’s designed to be portable so that you won’t have to change the value if you change syntax themes.


### Use in packages

Community packages can also use these values to deliver theme-appropriate editor decorations and user interfaces. In any of your package's `.less` files, you can access the theme variables by importing the `ui-variables` or `syntax-variables` file from Pulsar.

Your package should generally only specify structural styling, and these should come from [the style guide](https://github.com/pulsar-edit/styleguide). Your package shouldn't specify colors, padding sizes, or anything in absolute pixels. You should instead use the theme variables. If you follow this guideline, your package will look good out of the box with any theme!

Here's an example `.less` file that a package can define using theme variables:

```less
@import "ui-variables";

.my-selector {
	background-color: @base-background-color;
	padding: @component-padding;
}
```

```less
@import "syntax-variables";

.my-selector {
	background-color: @syntax-background-color;
}
```

## Development workflow

There are a few tools to help make theme development faster and easier.

### Live reload

Reloading by pressing <kbd class="platform-linux platform-win">Alt+Ctrl+R</kbd><kbd class="platform-mac">Alt+Cmd+Ctrl+L</kbd> after you make changes to your theme is less than ideal. That’s why Pulsar supports live updating of styles on Pulsar windows in dev mode through the {dev-live-reload} package.

To launch a dev mode window:

- open your theme directory in a dev window by selecting the _View > Developer > Open in Dev Mode_ menu item; or
- launch Pulsar from the terminal with `pulsar --dev`.

If you'd like to reload all the styles at any time, you can use the shortcut <kbd class="platform-linux platform-win">Alt+Ctrl+R</kbd><kbd class="platform-mac">Alt+Cmd+Ctrl+L</kbd>.

### Developer tools

Pulsar is based on the Chromium browser and supports its developer tools. You can open them by selecting the _View > Developer > Toggle Developer Tools_ menu, or by using the <kbd class="platform-linux platform-win">Ctrl+Shift+I</kbd><kbd class="platform-mac">Alt+Cmd+I</kbd>.

The dev tools allow you to inspect elements and take a look at their CSS properties.

![Developer Tools](/img/atom/dev-tools.png)

Check out Google's [extensive tutorial](https://developer.chrome.com/devtools/docs/dom-and-styles) for a short introduction.

### Pulsar styleguide

If you are creating an UI theme, you'll want a way to see how your theme changes affect all the components in the system. The {styleguide} is a page that renders every component Pulsar supports.

To open the Styleguide, open the command palette with <kbd class="platform-linux platform-win">Ctrl+Shift+P</kbd><kbd class="platform-mac">Cmd+Shift+P</kbd> and search for `styleguide`, or use the shortcut <kbd class="platform-linux platform-win">Ctrl+Shift+G</kbd><kbd class="platform-mac">Cmd+Ctrl+Shift+G</kbd>.

![Style Guide](/img/atom/styleguide.png)

### Side by side

Sometimes when creating a theme (or package) things can go wrong and the editor becomes unusable. E.g. if the text and background have the same color or something gets pushed out of sight. To avoid having to open Pulsar in "normal" mode to fix the issue, it's advised to open **two** Pulsar windows: one for making changes and one in dev mode to see the changes getting applied.

![Side by side screenshot](/img/atom/theme-side-by-side.png)

> Make changes on the **left**, see the changes getting applied in dev mode
> on the **right**.

Now if you mess up something, only the window in dev mode will be affected and you can easily correct the mistake in your “normal” window.

## Publish your theme

Once you're happy with your theme and would like to share it with other Pulsar users, it's time to publish it.

Follow the steps on the [Publishing](../publishing/) page. The example used is for the Word Count package, but publishing a theme works exactly the same.
