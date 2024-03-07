---
title: Check Pulsar and Package Settings
layout: doc.ejs
---

In some cases, unexpected behavior might be caused by settings in Pulsar or in
one of the packages.

Open Pulsar's [Settings View](https://github.com/pulsar-edit/settings-view) with
**_LNX/WIN_**: [[Ctrl+,]] -
**_MAC_**: [[Cmd+,]],
the
**_LNX_**: _Edit > Preferences_ -
**_MAC_**: _Pulsar > Preferences_ -
**_WIN_**: _File > Preferences_
menu option, or the `Settings View: Open` command from the
[Command Palette](https://github.com/pulsar-edit/command-palette).

![Settings View](/img/atom/settings-view.png)

Check Pulsar's settings in the Settings View, there's a description of most
configuration options in the [Basic Customization section](../../using-pulsar/#configuration-key-reference).
For example, if you want Pulsar to hide the invisible symbols representing
whitespace characters, disable the "Show Invisibles" option.

Some of these options are also available on a per-language basis which means
that they may be different for specific languages, for example JavaScript or
Python. To check the per-language settings, open the settings for the language
package under the Packages tab in the Settings View, for example the
language-javascript or language-python package.

Since Pulsar ships with a set of packages and you can also install additional
packages yourself, check the list of packages and their settings. For instance,
if you'd like to get rid of the vertical line in the middle of the editor,
disable the [Wrap Guide package](https://github.com/pulsar-edit/wrap-guide).
And if you don't like it when Pulsar strips trailing whitespace or ensures that
there's a single trailing newline in the file, you can configure that in the
[whitespace package's](https://github.com/pulsar-edit/whitespace) settings.

![Package Settings](/img/atom/package-settings.png)

If you are having trouble locating any given setting, Pulsar's `settings-view` comes
with a built in search tool that can help you find the setting you are looking for.
