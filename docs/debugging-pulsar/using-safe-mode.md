---
title: Using Safe Mode
layout: doc.ejs
---

A large part of Pulsar's functionality comes from packages you can install.
Pulsar will also execute the code in your [init script](#the-init-file) on
startup. In some cases, these packages and the code in the init script might be
causing unexpected behavior, problems, or performance issues.

To determine if that is happening, start Pulsar from the terminal in safe mode:

```sh
$ pulsar --safe
```

This starts Pulsar, but does not load packages from
**_LNX/MAC_**: `~/.pulsar/packages` or `~/.pulsar/dev/packages` -
**_WIN_**: `%USERPROFILE%\.pulsar\packages` or `%USERPROFILE%\.pulsar\dev\packages`.
and disables loading of your init script. If you can no longer reproduce the
problem in safe mode, it's likely it was caused by one of the packages or the
init script.

If removing or commenting out all content from the init script and starting
Pulsar normally still produces the error, then try figuring out which package is
causing trouble. Start Pulsar normally again and open the Settings View with
**_LNX/WIN_**: [[Ctrl+,]] -
**_MAC_**: [[Cmd+,]].
Since the Settings View allows you to disable each
installed package, you can disable packages one by one until you can no longer
reproduce the issue. Restart Pulsar or reload Pulsar with
**_LNX/WIN_**: [[Ctrl+Shift+F5]] -
**_MAC_**: [[Alt+Cmd+Ctrl+L]].
after you disable each package to make sure it's completely gone.

When you find the problematic package, you can disable or uninstall the package.
We strongly recommend creating an issue on the package's GitHub repository.
