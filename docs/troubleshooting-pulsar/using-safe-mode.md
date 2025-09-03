---
title: Using safe mode
layout: doc.ejs
---

A large part of Pulsar’s functionality comes from packages you can install. Pulsar will also execute the code in your [init script](/customizing-pulsar/the-init-file) on startup. In some cases, these packages and the code in the init script might be causing unexpected behavior, problems, or performance issues.

To determine if that is happening, start Pulsar from the terminal in safe mode:

```sh
$ pulsar --safe
```

This starts Pulsar, but does not load packages from <span class="platform-mac platform-linux">`~/.pulsar/packages` or `~/.pulsar/dev/packages`</span> <span class="platform-win">`%USERPROFILE%\.pulsar\packages` or `%USERPROFILE%\.pulsar\dev\packages`</span> and disables loading of your init script. If you can no longer reproduce the problem in safe mode, it’s likely it was caused by one of the packages or the init script.

If removing or commenting out all content from the init script and starting Pulsar normally still produces the error, then try figuring out which package is causing trouble. Start Pulsar normally again and [open the settings view](/using-pulsar/basics/#settings-and-preferences) with <kbd class="platform-linux platform-win">Ctrl+,</kbd><kbd class="platform-mac">Cmd+,</kbd>. Since the settings view allows you to disable each installed package, you can disable packages one by one until you can no longer reproduce the issue. Restart Pulsar or reload Pulsar with <kbd class="platform-linux platform-win">Ctrl+Shift+F5</kbd><kbd class="platform-mac">Alt+Cmd+Ctrl+L</kbd> after you disable each package to make sure it’s completely gone.

When you find the problematic package, you can disable or uninstall the package. We strongly recommend creating an issue on the package’s GitHub repository.
