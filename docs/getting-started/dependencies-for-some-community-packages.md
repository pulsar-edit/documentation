---
title: Installing dependencies for some community packages
layout: doc.ejs
---

:::warning Warning

This is an advanced topic and it might not be necessary! Most community packages do not use native modules, so you should ignore these instructions until they’re needed.

However, some popular packages will involve the use of native modules. Please read this page if you’re planning to install one of the packages below:

* [x-terminal-reloaded](https://web.pulsar-edit.dev/packages/x-terminal-reloaded)
* [Hydrogen](https://web.pulsar-edit.dev/packages/hydrogen) (which should be [installed directly from GitHub](https://github.com/pulsar-edit/package-backend/blob/main/docs/reference/Admin_Actions.md#hydrogen))

:::

Because Pulsar runs on Electron, it is able to use Node modules to complete tasks. Node modules, though written in JavaScript, sometimes also use code written in a lower-level language and bridged to JavaScript. We’ll refer to these as **native modules**.

This isn’t something that a user needs to concern themselves with when downloading Pulsar, since the modules that we use have been pre-compiled for your operating system. But it may become important when installing community packages. Since any community package can use any Node module, some of them will use native modules, and those modules will need to be compiled for the operating system they’re being run on.

Further: newer releases of Pulsar might carry updates to the underlying Electron framework — which, in turn, involves updating the version of Node that is available to Pulsar. For this reason, packages that use native modules will often need to rebuild whenever Pulsar’s version of Electron changes. The easiest way to deal with this is to have a local toolchain for building native modules in Node.

The good news is that lots of developers will have this toolchain already. If you’ve already got `npm` installed on your machine and use it occasionally, it is extremely likely that you’ve already got the tools you need.

If not, your computer may require additional setup. Choose the section below that corresponds to your operating system.

## Linux

Building native modules for Node on Linux will require `gcc` and `python`.

On Debian/Ubuntu systems, this could be as simple as running `apt install build-essential`. Other distros will have an equivalent package that installs `gcc` and its associated tools.

It’s extremely likely that your system already has a working version of Python; if not, you can install Python 3 from your distro’s package manager.

You can verify that your system has all the needed tools by running `ppm install --check`.

## macOS

Building native modules for Node on macOS will require `clang` and `python`.

macOS users will be prompted by the system to install Xcode command-line tools the first time they run `git`, `gcc`, or `clang`. You can also run `xcode-select --install` to trigger the prompt. macOS will download and install the tools automatically. **A full installation of Xcode is not necessary.**

You can verify that your system has all the needed tools by running `ppm install --check`. (Be sure to install shell commands first, as described in the [Adding terminal commands](/getting-started/adding-terminal-commands/#macos) article.)

## Windows

To be able to build native modules on Windows, you'll need to install the following applications:

* Build Tools for Visual Studio (or the Visual Studio IDE) with the **Desktop development with C++** component
* Python 3 (preferably the most recent version)

Full installation instructions follow.

### Installing Visual Studio Tools

:::warning

The instructions below have _nothing to do with_ **Visual Studio Code**. If you end up installing VS Code in your quest to follow the instructions on this page, you’ve taken a wrong turn.

:::

You **do not** need a full installation of Visual Studio to be able to compile native Node modules. But you do need some components that must be installed via the Visual Studio installer, so [visit this page](https://visualstudio.microsoft.com/downloads/) and search for **Build Tools for Visual Studio 2022**. You will download an installer pre-configured to install these components.

:::tip
If you want to install the Visual Studio IDE — or already have it installed — then you can use that _instead of_ Build Tools for Visual Studio, as long as you still install the **Desktop development with C++** component as described below.

If you have a pre-existing installation of Visual Studio 2019, or its build tools, then those will also work just fine.
:::

You must also select the **Desktop development with C++** component when customizing your installation. These are the components that will allow Node to compile native modules with the `node-gyp` tool.

![selecting the C++ component](/img/atom/vs-cpp-selected-inset.png)

You will not need anything else.

If you didn’t install the right things the first time around, you can re-run the Visual Studio installer and modify your installation.

### Installing Python

Python can be downloaded from [the Python website](https://www.python.org/downloads/windows/). The latest version of Python 3 is a good choice.

When you run the Python installer, ask to customize the installation, then check the box that says “Add python.exe to PATH.” This will make things a bit easier later on.


### Checking your path

At this point, it is assumed that you can invoke `pulsar` and `ppm` from a terminal. If you haven’t done so yet, you should follow the steps in the [Adding terminal commands](/getting-started/adding-terminal-commands/#windows) article.

You should also make sure that you have `python` in your path. If you were able to check the aforementioned box during Python installation, then that should be taken care of, but this is still a good opportunity to note the location of your Python installation, since we’ll need to specify it soon.

Open your terminal application and run the following command:

```
Get-Command python
```

![Get-Command python](/img/atom/powershell-get-command-python.png)

You may have to make your window wider just to fit the information. In my case, it’s just barely wide enough for me to discern that the Python executable is located at the path `C:\Users\Andrew\AppData\Local\Programs\Python\Python312\python.exe`.

### Running `ppm` to check native module installation

Since you followed the instructions in [Adding terminal commands](/getting-started/adding-terminal-commands/#windows), you should be able to run `ppm` from your terminal. Try `ppm --version`; it should produce something like this:

![ppm --version](/img/atom/ppm-version-windows.png)

At this point, we can use `ppm` itself to help us set up our native module build environment. Run `ppm install --check` to trigger a special behavior from `ppm`: it’ll try to compile a dummy native module, then report any obstacles it encountered.

![ppm install --check](/img/atom/ppm-install-check-windows-success.png)

If `ppm install --check` works and doesn’t raise any errors, you’re done!

Otherwise, here are some things to try:

#### Install `setuptools` for Python

`ppm` may complain about a lack of `distutils`. That’s something we can fix by installing Python’s `setuptools` package.

Run this command in your terminal:

```
pip install setuptools
```

If it doesn’t know what `pip` is, then your Python path is not set up properly. Hopefully, it’ll succeed at installing `setuptools`, at which point you should run `ppm install --check` again. If it still fails, keep reading.

#### Tell `ppm` about the path to your version of Python

If `ppm` still complains about missing `distutils` after the step above, or if it thinks you don’t have any build tools installed, it might not be finding your version of Python. Run `ppm --version` again and look at the version of Python it reports: if it’s not the version you just installed, then it doesn’t know how to find your Python installation.

You can tell it about your Python executable two different ways, but let’s first try this one:

```
ppm config set python "C:\Users\(my-user)\AppData\Local\Programs\Python\Python312\python.exe"
```

Again, this is where Python was installed for me; you should make sure this matches the location of your own Python installation.

After you run this command, try `ppm --version` again. If it picks up on your new Python version, you’ve succeeded:

![ppm --version](/img/atom/ppm-version-windows.png)

Otherwise, you can try the other way of telling `ppm` about your Python location: the `PYTHON` environment variable. Run this in your terminal, again confirming you’re using the correct path to your own installation of Python:

```
$env:Python = "C:\Users\(my-user)\AppData\Local\Programs\Python\Python312\python.exe"
```

If `ppm` recognizes your Python version when you run `ppm --version`, you should try running `ppm install --check` again. If it passes, you’ve succeeded!

:::tip
If this second technique succeeded, then you’ll want to make sure that `PYTHON` is defined automatically in future shells as well. You can define it using the same process we documented in the earlier [Adding terminal commands](/getting-started/adding-terminal-commands/#windows) article.
:::

#### Ensure you installed your Visual Studio tools correctly

If `ppm` still thinks you don’t have the right build tools installed, then it’s worth re-checking whether you’ve installed your Visual Studio tools correctly.

Re-run the Visual Studio installer and confirm:

* You _must_ have **Visual Studio 2022 Build Tools** or **Visual Studio 2019 Build Tools** installed — or the full Visual Studio IDE of either version.
* Select whichever one you have installed and click on [[Modify]].
* You _must_ have “Desktop development with C++” checked. If it is not checked, check it, then click on the [[Modify]] button at the bottom right corner of the window. It will install new components.

If you had to make any changes here, wait for the installer to finish, then run `ppm install --check` again.

### Installing a package with a native module

Once `ppm` thinks it can build native modules correctly, put it to the test! You can now try to install a package that depends on native modules.

For instance, you can attempt to install `x-terminal-reloaded` either through Pulsar or via the command line:

```
ppm install x-terminal-reloaded
```

It’s unlikely, but still possible, that you might run into failures here that you didn’t encounter earlier while running `pulsar install --check`. If so, some of the steps above may still be useful.

If you’ve followed the instructions on this page and still can’t get your package to install, join us [on Discord](https://discord.gg/7aEbB9dGRT) or [in GitHub Discussions](https://github.com/orgs/pulsar-edit/discussions) and we’ll try to get you back on track.

!!!include(_partial_docs/native-module-versions.md)!!!
