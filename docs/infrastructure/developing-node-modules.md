---
title: Developing Node modules
layout: doc.ejs
---

Pulsar contains a number of packages that are Node modules instead of Pulsar packages. If you want to make changes to the Node modules, for instance `atom-keymap`, you have to link them into the development environment differently than you would a normal Pulsar package.

## Linking a Node module into your Pulsar dev environment

Here are the steps to run a local version of a Node module within Pulsar. We’re using `atom-keymap` as an example:

::: tabs#behind-pulsar

@tab Linux

```sh
$ git clone https://github.com/pulsar-edit/atom-keymap.git
$ cd atom-keymap
$ npm install
$ npm link
$ cd <WHERE YOU CLONED PULSAR>
$ npm link atom-keymap

# This is the special step; it makes the Node module work with Pulsar's version
# of Node. If the Node module in question does not have any native code
# (C/C++), you can skip this step.
$ pulsar -p rebuild

# If you have cloned Pulsar in a different location than ~/github/pulsar
# you need to set the following environment variable
$ export ATOM_DEV_RESOURCE_PATH=<WHERE YOU CLONED PULSAR>

# Should work!
$ pulsar --dev .
```

@tab Mac

```sh
$ git clone https://github.com/pulsar-edit/atom-keymap.git
$ cd atom-keymap
$ npm install
$ npm link
$ cd <WHERE YOU CLONED PULSAR>
$ npm link atom-keymap

# This is the special step; it makes the Node module work with Pulsar's version
# of Node. If the Node module in question does not have any native code
# (C/C++), you can skip this step.
$ pulsar -p rebuild

# If you have cloned Pulsar in a different location than ~/github/pulsar
# you need to set the following environment variable
$ export ATOM_DEV_RESOURCE_PATH=<WHERE YOU CLONED PULSAR>

# Should work!
$ pulsar --dev .
```

@tab Windows

```sh
$ git clone https://github.com/pulsar-edit/atom-keymap.git
$ cd atom-keymap
$ npm install
$ npm link
$ cd <WHERE YOU CLONED PULSAR>
$ npm link atom-keymap

# This is the special step; it makes the Node module work with Pulsar's version
# of Node. If the Node module in question does not have any native code
# (C/C++), you can skip this step.
$ pulsar -p rebuild

# If you have cloned Pulsar in a different location than %USERPROFILE%\github\pulsar
# you need to set the following environment variable
$ setx ATOM_DEV_RESOURCE_PATH=<WHERE YOU CLONED PULSAR>

# Should work!
$ pulsar --dev .
```

:::

After you get the Node module linked and working, you should be able to make changes to the module as described below:

<!-- NOTE: The section below used to suggest you had to re-run like six different commands every time you made a change to a Node module, but this has never been my experience. What follows is what I believe to be true based on many hours of firsthand experience with this. —@savetheclocktower -->

* If the module is a JavaScript-only module and contains no native code (C/C++), then you should be able to see your changes reflected simply by reloading the window via the **Window: Reload** command.
* If the module contains native code (C/C++) and you make changes to the native code, you’ll likely have to rebuild the module yourself (via, e.g., `npx node-gyp rebuild` and then rerun `pulsar -p rebuild` to rebuild the module again for Pulsar’s version of Node. At that point, you should be able to run **Window: Reload** and see your changes reflected.

If your changes bear fruit, it’s a good idea to contribute them upstream so you can unlink your locally modified version of the package.
