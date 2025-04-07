---
title: Hacking on the core
layout: doc.ejs
---

If you’re hitting a bug in Pulsar or just want to experiment with adding a feature to the core of the system, you’ll want to run Pulsar in dev mode with access to a local copy of the Pulsar source.

## Check out the source code

Check out the Pulsar source from GitHub into a directory of your choosing:

```sh
$ git clone git@github.com:pulsar-edit/pulsar.git
```

## Set up dependencies

You should install a compatible version of Node. Read the `.nvmrc` file to learn which version of Node is best to use. If you don’t have one yet, you’ll probably find it useful to install a tool like <span class="platform-linux platform-mac"><a href="https://github.com/nvm-sh/nvm">NVM</a> or <a href="https://asdf-vm.com/">asdf</a></span><span class="platform-win"><a href="https://github.com/coreybutler/nvm-windows">NVM for Windows</a> or <a href="https://github.com/Schniz/fnm">fnm</a></span> to manage multiple versions of Node.

Pulsar uses [Yarn](https://yarnpkg.com/) to manage Node dependencies. Once you’ve got the right version of Node set up, you can [install Yarn using these instructions](https://classic.yarnpkg.com/lang/en/docs/install/). (You want the “classic stable” version 1 of Yarn, not version 2.)

To install the project’s Node dependencies, run

```sh
$ yarn install
$ yarn build
```

## Running in development mode

Once you have a local copy of Pulsar cloned and bootstrapped, you can then run Pulsar in development mode. But first, if you cloned Pulsar to somewhere other than <span class="platform-linux platform-mac">`~/github/pulsar`</span><span class="platform-win">`%USERPROFILE%\github\pulsar`</span>, you will need to set the `ATOM_DEV_RESOURCE_PATH` environment variable to point to the folder in which you cloned Pulsar.

To run Pulsar in dev mode, use the `--dev` parameter from the terminal:

```sh
$ pulsar --dev <path-to-open>
```

There are a couple benefits of running Pulsar in dev mode:

1. When the `ATOM_DEV_RESOURCE_PATH` environment variable is set correctly, Pulsar is run using the source code from your local `pulsar-edit/pulsar` repository. This means you don’t have to rebuild after every change — just reload your current window with **Window: Reload**.

    (Changes to “main process” code — basically any code that lives in `src/main-process` — will require a full relaunch of Pulsar, but most of Pulsar’s logic is in the renderer process.)

2. Packages that exist in <span class="platform-linux platform-mac">`~/.pulsar/dev/packages`</span><span class="platform-win">`%USERPROFILE%\.pulsar\dev\packages`</span> are loaded instead of packages of the same name normally loaded from other locations.

    This means that you can have development versions of packages you use loaded (via `pulsar -p link --dev [path-to-local-copy-of-a-package]`) but easily go back to the stable versions by launching without dev mode. This makes dev mode useful for developing packages even when `ATOM_DEV_RESOURCE_PATH` isn’t set.

3. Packages that contain stylesheets, such as syntax themes, will have those stylesheets automatically reloaded by the {dev-live-reload} package. This does not live reload JavaScript or CoffeeScript files — you’ll need to reload the window (`window:reload`) to see changes to those.

## Running Pulsar core tests locally

### Within the terminal

In order to run Pulsar core tests from the terminal, first be certain to set the `ATOM_DEV_RESOURCE_PATH` environment variable as mentioned above and then:

```sh
$ cd <path-to-your-local-pulsar-repo>
$ pulsar --test spec
```

### Within Pulsar

First, make sure to set `ATOM_DEV_RESOURCE_PATH`; then launch Pulsar and open a project whose root is the root of the Pulsar codebase. You may then run the package specs from within Pulsar by invoking the **Window: Run Package Specs** command. This will spawn a window that runs the specs and reports on their outcomes.

## Running Pulsar builtin package tests locally

### Within the terminal

You can run a single package’s tests in similar fashion. For instance, to run the specs for the `autocomplete-plus` package, run the following from the root of the Pulsar project:

```sh
$ cd <path-to-your-local-pulsar-repo>
$ pulsar --test packages/autocomplete-plus/spec
```

Since different packages may have configured different test runners, you are encouraged to run each builtin package’s specs separately for the best results. However, you may experiment with glob syntax if you wish to run several at once and are willing to tolerate unusual behavior.

For instance, this will run all the specs for builtin language packages:

```sh
$ cd <path-to-your-local-pulsar-repo>
$ pulsar --test packages/language-**/spec
```

### Within Pulsar

You can run a single builtin package’s specs the same way you’d run specs for a package that _isn’t_ builtin: open the builtin package’s root directory in Pulsar as its own project, then invoke the **Window: Run Package Specs** command.
