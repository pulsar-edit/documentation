---
title: Maintaining a fork of a core package
layout: doc.ejs
---

Originally, each of Atom’s core packages resided in a separate repository. In 2018, in an effort to streamline the development of Atom by reducing overhead, the Atom team [consolidated many core Atom packages](https://github.com/atom/atom/blob/master/docs/rfcs/003-consolidate-core-packages.md) into the [atom/atom repository](https://github.com/atom/atom).

For example, the one-light-ui package was originally maintained in the [atom/one-light-ui](https://github.com/atom/one-light-ui) repository, but was moved to the [`packages/one-light-ui` directory](https://github.com/pulsar-edit/one-light-ui) in the main repository.

The Pulsar team has continued this trend and has move even more packages into the core, particularly default language packages. A list of these packages can be found in [this document](https://github.com/pulsar-edit/pulsar/blob/master/packages/README.md).

Eventually Pulsar’s goal is to have all core packages (the packages that are included in Pulsar by default) migrated directly into the `pulsar-edit/pulsar` repository. Progress toward this goal can be monitored on [this GitHub issue](https://github.com/pulsar-edit/pulsar/issues/512).

If you forked one of the core packages before it was moved into the `atom/atom `or `pulsar-edit/pulsar` repository, and you want to continue merging upstream changes into your fork, please follow the steps below.

## Step-by-step guide

For the sake of this guide, let’s assume that you forked the [pulsar-edit/one-light-ui](https://github.com/pulsar-edit/one-light-ui) repository, renamed your fork to `one-light-ui-plus`, and made some customizations.

### Add `pulsar-edit/pulsar` as a Remote

Navigate to your local clone of your fork:

```sh
$ cd path/to/your/fork
```

Add the [`pulsar-edit/pulsar` repository](https://github.com/pulsar-edit/pulsar) as a git remote:

```sh
$ git remote add upstream https://github.com/pulsar-edit/pulsar.git
```

### Get the latest changes for the core package

::: tip
Follow these steps each time you want to merge upstream changes into your fork.
:::

Fetch the latest changes from the pulsar-edit/pulsar repository:

```sh
$ git fetch upstream
```

Identify recent changes to the core package. For example, if you’re maintaining a fork of the one-light-ui package, then you’ll want to identify recent changes in the `packages/one-light-ui` directory:

```sh
$ git log --oneline upstream/master -- packages/one-light-ui
f884f6de8 [themes] Rename A[a]tom -> P[p]ulsar
0db3190f4 Additional rebranding where needed
234adb874 Remove deprecated code strings
...
```

Look through the log and identify the commits that you want to merge into your fork.

### Merge upstream changes into your fork

For each commit that you want to bring into your fork, use [`git format-patch`](https://git-scm.com/docs/git-format-patch) in conjunction with [`git am`](https://git-scm.com/docs/git-am). For example, to merge commit `f884f6de8` into your fork:

```sh
$ git format-patch -1 --stdout f884f6de8 | git am -p3
```

Repeat this step for each commit that you want to merge into your fork.
