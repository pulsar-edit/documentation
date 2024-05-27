---
title: Updating to the latest version
layout: doc.ejs
---

You might be running into an issue which was already fixed in a more recent
version of Pulsar than the one you're using.

If you're using a released version, check which version of Pulsar you're using:

```sh
$ pulsar --version
> Pulsar  : 1.63.0-dev
> Electron: 12.2.3
> Chrome  : 89.0.4389.128
> Node    : 14.16.0
```

You can find the latest releases on the [Pulsar website](https://pulsar-edit.dev/download.html). Follow the links for either the latest regular release or, if you prefer, the latest rolling release. If you submit an issue against Pulsar, be sure to note which version you’re using.

The built in package {pulsar-updater} should notify you when a new version of Pulsar is available. By default, it runs on Pulsar startup, but you can always ask it to recheck by running **Pulsar Updater: Check for Update** in the command palette.

If you're building Pulsar from source, pull down the latest version of the repo and [rebuild](/contributing-to-pulsar/building-pulsar). Make sure that if logging an issue you include the latest commit hash you built from.
