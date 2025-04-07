---
title: Find crash logs
layout: doc.ejs
---

::: tabs#debugging

@tab Linux

When Pulsar crashes, it should write a core dump if system settings permit. In order to find whether the core dump is written and to where, consult the documentation for your distribution of Linux. Once you have the core dump, you can save it to send in later if it is needed for debugging.

@tab macOS

When Pulsar crashes, you will find a crash dump in Console.app. You can launch Console.app using Spotlight or you can find it in `/Applications/Utilities/Console.app`. Once you have launched the program, you can find the latest crash dump by following these instructions:

1. Click "User Reports" in the left-most column
2. Find the latest entry in the middle column that starts with `Pulsar` and ends with `.crash`

Once you have the crash dump, you can save it to send in later if it is needed for debugging.

@tab Windows

When Pulsar crashes, you will find a crash dump inside your `%TEMP%\Pulsar Crashes` directory. It will be the newest file with the `.dmp` extension. Once you have the crash dump, you can save it to send in later if it is needed for debugging.

:::
