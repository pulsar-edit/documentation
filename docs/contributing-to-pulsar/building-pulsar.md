---
title: Building Pulsar
layout: doc.ejs

---

If you want to investigate a bug, implement a new feature in Pulsar’s core, or just tinker, you’ll need to build and run Pulsar from source.

The Pulsar application code can be found in the
[pulsar-edit/pulsar](https://github.com/pulsar-edit/pulsar) repository.

## Requirements and dependencies

To build Pulsar you will need to meet some basic requirements:

- An installation of Node. We endeavor to keep `.nvmrc` updated with the best version of Node to use (allowing users of [nvm](https://github.com/nvm-sh/nvm) to select the correct version more easily), but technically the best version of Node to use is [the one that corresponds to the version of Electron that’s being used on the `master` branch](https://releases.electronjs.org/release) (or whichever branch you’re building).

  You can determine the correct version of Electron by looking for the `electronVersion` key in [`package.json`](https://github.com/pulsar-edit/pulsar/blob/master/package.json) for the branch you’re building.

  We strongly recommend that you use a version manager like [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://asdf-vm.com/) instead of relying on whatever Node may be installed globally on your system.

- yarn (enable with `corepack enable`; further instructions below).
- Recent versions of Git and Python 3.
- A C++ compilation toolchain.

For OS- or distribution-specific instructions, see below:

::: tabs#core-hacking

@tab Linux

On Linux, certain libraries must be installed in order to build Pulsar:

  - [`libsecret`](https://wiki.gnome.org/Projects/Libsecret) development headers (for storage of secrets)
  - `libx11` and various libraries relating to [XKB](https://www.x.org/wiki/XKB/) (so that Pulsar can detect and handle keyboard layouts in X11)
  - `libwayland` (so Pulsar can detect and handle keyboard layouts in [Wayland](https://en.wikipedia.org/wiki/Wayland_(protocol)))

These are the packages believed to be necessary for various distributions. If any of these are wrong or insufficient, please [open an issue](https://github.com/pulsar-edit/documentation/issues) so we can keep these instructions accurate.

### Ubuntu/Debian

```sh
# Install development packages
apt install build-essential libsecret-1-dev libx11-dev libxkbfile-dev libxkbcommon-dev libxkbcommon-x11-dev libxkbcommon0 xkb-data libwayland-dev libwayland-client0
```

### Fedora/RHEL

```sh
# Install development packages
dnf --assumeyes install make gcc gcc-c++ glibc-devel git-core libsecret-devel rpmdevtools libX11-devel libxkbfile-devel libxkbcommon-devel nss atk gdk-pixbuf2 gtk3 mesa-dri-drivers wayland-devel libwayland-client
```

### Arch

```sh
# Install development packges
pacman -S base-devel libxkbfile libsecret libx11 libxcrypt-compat libxkbcommon libxkbcommon-x11 wayland
```

### OpenSUSE

```sh
# Install development packages
zypper in -t pattern devel_basis
zypper in libX11-devel libxkbfile-devel libsecret-devel libxkbcommon libxkbcommon-x11-0 libxkbcommon0 libwayland-client0 wayland
```

@tab macOS

macOS installations must have the components described on the [Installing dependencies for some community packages](/getting-started/dependencies-for-some-community-packages/#macos) page.

You can run `xcode-select --install` to setup these build tools if you think they’re not already present. You _do not_ need a full installation of Xcode.

@tab Windows

Install all of the components described on the [Installing dependencies for some community packages](/getting-started/dependencies-for-some-community-packages/#installing-visual-studio-tools) page.

In particular, you must have either Visual Studio or Visual Studio Tools (_not_ Visual Studio Code) and the “Desktop development with C++” component _must_ be enabled.

If you don’t have either one installed and you want to get set up quickly, install Visual Studio Tools as directed in the instructions above.

:::

## Building and running the application

### Check out the code

First, check out the source to a directory of your choosing.

```sh
git clone https://github.com/pulsar-edit/pulsar.git && cd pulsar
```

### Pick the right Node version and ensure Yarn is present

Switch to the correct version of Node for the project; if you’re running `nvm`, this should be as simple as `nvm use` (which will install the version of Node specified in specified in [pulsar/.nvmrc](https://github.com/pulsar-edit/pulsar/blob/master/.nvmrc)). Then, in order to get `yarn`, you’ll need to run `corepack enable`.

```sh
nvm use # Or the equivalent for your version manager
corepack enable
```

You’ll only need to run `corepack enable` the first time for a given version of Node.

Certain tool version managers might require a “reshim” step here; for instance, if you’re using `asdf`, you should run `asdf reshim` to ensure it creates a shim executable for `yarn`.

### Initialize the submodules

Run the following to initialize and update the submodules:

```sh
git submodule init && git submodule update
```

### Build the dependencies

For reasons mainly having to do with dependency resolution, we use `yarn` rather than `npm` for installing dependencies.

Here’s how to install the dependencies for Pulsar and `ppm`:

```sh
yarn install
yarn build
yarn build:apm
```

Depending on which option you choose below, `ppm` might need [additional configuration](https://docs.pulsar-edit.dev/contributing-to-pulsar/using-ppm/).

### Option 1: `yarn start`

Here your options diverge; you can choose the one that fits your style of development best.

The first option is to run the `start` task; it’ll spawn a debug copy of Pulsar by invoking the `electron` binary directly. Logging information will go into your terminal.

```sh
yarn start
```

### Option 2: `ATOM_DEV_RESOURCE_PATH`

If you have Pulsar installed already, you don’t have to build your own copy just to run it from source. Instead, do this:

1. Ensure no instance of Pulsar is currently running.
2. Set the `ATOM_DEV_RESOURCE_PATH` environment variable to the full path of where the Pulsar source code exists on disk.
3. Launch Pulsar with the `--dev` flag so that dev mode is enabled.

The exact method of doing so varies by platform, but on macOS/Linux you could do:

```sh
ATOM_DEV_RESOURCE_PATH=/path/to/pulsar pulsar --dev .
```

[direnv](https://direnv.net/) is a handy way of associating certain environment variables with certain working directories and might make this workflow even easier.

### Option 3: Build binaries

The first two options are great for iterating on changes to the Pulsar source code, but they don’t actually _build_ the app as a standalone binary. For that you need the build script, invoked via `yarn dist`.

The build script will detect your OS and build the right binary for it; it’ll also automatically build for your system’s CPU architecture. For example, building on an `x86_64` CPU will produce binaries for `x86_64`, and building on `arm64` will only produce binaries for `arm64`. After running you will find your built application in `pulsar/binaries`.

:::note Caveats

It is not possible to “cross-build” for different OSes; for instance, if you want a Linux binary, you must generate it from a Linux machine.

It is also not _currently_ possible to build for one processor architecture from another, but we hope to make this easier soon.

:::


::: tabs#core-hacking

@tab Linux

Running `yarn dist` will attempt to create all four variants: `tar.gz` (suitable for most Linux distributions), `AppImage` (suitable for most Linux distributions and more self-contained than the `tar.gz`), `deb` (for Debian or Ubuntu based distributions), and `rpm` (for Red Hat or Fedora based distributions) binaries.

<!-- TODO: This is not currently true, but it is a good idea! Uncomment when we add this in.

But you’ll probably want to build just one of these four. So you can select the actual target you want to build by appending the targets you want to build to the command:

- `yarn dist appimage`
- `yarn dist deb`
- `yarn dist rpm`
- `yarn dist targz`

You can also specify more than one — for instance, `yarn dist appimage targz` — to build those targets and skip the others.

-->

@tab macOS

`yarn dist` will create a `.dmg` and a `.zip`. These are nearly identical in practice.

As noted above, the build will be targeted to the system’s CPU architecture. On an Intel Mac this will create Intel binaries; on Apple silicon (M1, M2, etc.) this will create Apple Silicon binaries.

@tab Windows

<!-- TODO: Is the below still true? Check it to be sure. -->

By default, running `yarn dist` will attempt to create an `NSIS` installer as well as a “portable” executable which does not require installation.

<!-- TODO: Not true, but should be soon. Uncomment when it’s true!

If you wish to build only one, you can specify it by appending the appropriate target to the command:

- `yarn dist nsis`
- `yarn dist zip`

-->

:::
