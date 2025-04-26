---
title: Resetting to factory defaults
layout: doc.ejs
---

In some cases, you may want to reset Pulsar to “factory defaults” — in other words clear all of your configuration and remove all packages. This can easily be done by opening a terminal and executing:

::: tabs#debugging

@tab Linux

```sh
$ mv ~/.pulsar ~/.pulsar-backup
```

@tab macOS

```sh
$ mv ~/.pulsar ~/.pulsar-backup
```

@tab Windows

```sh
$ rename %USERPROFILE%\.pulsar .pulsar-backup
```

:::

Once that is complete, you can launch Pulsar as normal. Everything will be just as if you first installed Pulsar.

::: tip Tip

The command given above doesn’t delete the old configuration — just puts it somewhere that Pulsar can’t find it. If there are pieces of the old configuration you want to retrieve, you can find them in the <span class="platform-mac platform-linux">`~/.pulsar-backup`</span><span class="platform-win">`%USERPROFILE%\.pulsar-backup`</span> directory.

:::
