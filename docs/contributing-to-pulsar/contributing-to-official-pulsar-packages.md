---
title: Contributing to official Pulsar packages
layout: doc.ejs
---

Nearly all packages that ship with Pulsar now live in the main Pulsar repository. If you discover a bug or issue with an official Pulsar package, please [open the issue on the main repository](https://github.com/pulsar-edit/pulsar/issue/new/choose); we can move it to another repository if we need to.

## Hacking on packages

If your goal is to contribute fixes to a built-in package, you typically won’t have to build Pulsar from scratch! You should be able to use `ppm` (or `pulsar -p`) to link to a folder in the Pulsar repository.

### Cloning

The first step is creating your own clone. For some packages, you may also need to install the [requirements necessary for building Pulsar](../building-pulsar/) in order to run `pulsar -p install`.

For example, if you want to make changes to the {tree-view} package, fork the Pulsar repo on your GitHub account, then clone it:


```sh
$ git clone https://github.com/[your-github-username]/pulsar.git
```

From the root of where you cloned the repo on your disk, navigate to the `tree-view` package’s directory and install its dependencies:

```sh
$ cd packages/tree-view
$ pulsar -p install
> Installing modules ✓
```

Now you can link it to development mode so when you run an Pulsar window with `pulsar -p --dev`, it’ll load your fork instead of the built in package:

```sh
$ pulsar -p link --dev
```

### Running in development mode

Editing a package in Pulsar is a bit of a circular experience: you're using Pulsar to modify itself. What happens if you temporarily break something? You don't want the version of Pulsar you're using to edit to become useless in the process. For this reason, it’s a good idea to load packages in **development mode** while you are working on them. You’ll perform your editing in **stable mode**, only switching to development mode to test your changes.

To open a development mode window, use the **Application: Open Dev** command. You can also run dev mode from the command line with `pulsar --dev`.

To load your package in development mode, create a symlink to it in <span class="platform-mac platform-linux">`~/.pulsar/dev/packages`</span><span class="platform-win">`%USERPROFILE%\.pulsar\dev\packages`</span>. This occurs automatically when you clone the package with `pulsar -p develop`. You can also run `pulsar -p link --dev` and `pulsar -p unlink --dev` from the package directory to create and remove dev-mode symlinks.

### Installing dependencies

You'll want to keep dependencies up to date by running `pulsar -p update` after pulling any upstream changes.
