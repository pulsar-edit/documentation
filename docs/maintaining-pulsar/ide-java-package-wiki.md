---
title: IDE-Java Package Wiki
layout: doc.ejs
---

The following wiki article is a small piece of Pulsar/Atom's history.
It may also prove to be useful when dealing with this particulr package in the future.
This wiki entry was taken directly from the [`atom/ide-java` package wiki](https://github.com/atom/ide-java/wiki) and is mirrored here in case that ever becomes inaccessible.

::: warning Warning

The contents of this article do not in any way represent actions, thoughts, or ideas expressed by the Pulsar team.
Full credit for the content of the below page belongs to [@Damien Guard](https://github.com/damieng).

:::

## Incomplete Classpath Warning

In order to properly analyze Java files a project definition must be found that indicates the packages, paths to search for classes etc.

You should open the folder that contains the pom.xml or build.gradle file if you want full diagnostics, errors, auto-completion etc.

If you don't need the full analysis you can ignore this warning and work with a subset of the available features.
