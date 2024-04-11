---
title: Installing dependencies for some community packages
layout: doc.ejs
---

:::warning Warning

This is an advanced topic and it might not be necessary! Most community packages do not use native modules, so you should ignore these instructions until they’re needed.

However, some popular packages will involve the use of native modules. Please read this page if you’re planning to install one of the packages below:

* Terminal packages, particularly [x-terminal-reloaded](https://web.pulsar-edit.dev/packages/x-terminal-reloaded)
* [Hydrogen](https://web.pulsar-edit.dev/packages/hydrogen) (which should be [installed directly from GitHub](https://github.com/pulsar-edit/package-backend/blob/main/docs/reference/Admin_Actions.md#hydrogen))

:::

Because Pulsar runs on Electron, it is able to use Node modules to complete tasks. Node modules, though written in JavaScript, sometimes also use code written in a lower-level language and bridged to JavaScript. We’ll refer to these as **native modules**.

This isn’t something that a user needs to concern themselves with when downloading Pulsar, since the modules that we use have been pre-compiled for your operating system. But it may become important when installing community packages. Since any community package can use any Node module, some of them will use native modules, and those modules will need to be compiled for the operating system they’re being run on.

If you’ve already got `npm` installed on your machine and have used it on a regular basis, it is extremely likely that you’ve already got the tools you need.

Otherwise, some systems may require additional dependencies.

## Linux

Linux users will require a build toolchain. On Debian/Ubuntu systems, this could be as simple as running `apt install build-essential`.

## macOS

macOS users will be prompted by the system to install Xcode command-line tools the first time they run `git`, `gcc`, or `clang`. You can also run `xcode-select --install` to trigger the prompt. macOS will download and install the tools automatically. **A full installation of Xcode is not necessary.**

## Windows

To be able to build native modules on Windows, you'll need to install the following applications:

* Visual Studio
  - Make sure to install the "Desktop development with C++" Workload
  - Make sure to install the "Windows SDK"
* Python

!!!include(_partial_docs/native-module-versions.md)!!!
