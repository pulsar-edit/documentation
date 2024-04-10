---
title: Check for incompatible packages
layout: doc.ejs
---

If you have packages installed that use native Node modules, when you upgrade to a new version of Pulsar, they might need to be rebuilt. Pulsar detects this and through the [incompatible-packages package](https://github.com/pulsar-edit/pulsar/tree/master/packages/incompatible-packages) displays an indicator in the status bar when this happens.

![Incompatible Packages Status Bar Indicator](/img/atom/incompatible-packages-indicator.png "Incompatible Packages Status Bar Indicator")

If you see this indicator, click it and follow the instructions.
