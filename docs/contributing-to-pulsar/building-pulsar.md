---
title: Building Pulsar
layout: doc.ejs

---
<!-- TODO check all of this for accuracy, and if we want to keep these install instructions -->

<!-- TODO: It’s absolutely possible to hack on Pulsar’s core without building it… by setting `ATOM_DEV_RESOURCE_PATH`. I’ve never had to build Pulsar from source. I don’t know if there are any caveats, but we should find a way to mention that as an option. — @savetheclocktower -->

If you want to investigate a bug, implement a new feature in Pulsar’s core, or just tinker, you’ll need to build and run Pulsar from source.

The Pulsar application code can be found in the
[pulsar-edit/pulsar](https://github.com/pulsar-edit/pulsar) repository.

## Requirements and dependencies

To build Pulsar you will need to meet some basic requirements:

- Node.js (version specified in [pulsar/.nvmrc](https://github.com/pulsar-edit/pulsar/blob/master/.nvmrc),
  recommended installation is via [nvm](https://github.com/nvm-sh/nvm))
- yarn (enable with `corepack enable`)
- Git
- Python
- C++ toolchain
- [Libsecret](https://wiki.gnome.org/Projects/Libsecret) development headers

For OS or distribution specific instructions see below:

::: tabs#core-hacking

@tab Linux

### Ubuntu/Debian

```sh
# Install development packages
apt install build-essential libxkbfile-dev libsecret-1-dev libx11-dev
```

### Fedora/RHEL

```sh
# Install development packages
dnf --assumeyes install make gcc gcc-c++ glibc-devel git-core libsecret-devel rpmdevtools libX11-devel libxkbfile-devel nss atk gdk-pixbuf2 gtk3 mesa-dri-drivers
```

### Arch

```sh
# Install the development packges
pacman -S base-devel libxkbfile libsecret libx11 libxcrypt-compat
```

### OpenSUSE

```sh
# Install development packages
zypper in -t pattern devel_basis
zypper in libX11-devel libxkbfile-devel libsecret-devel
```

@tab macOS

macOS installations must have the components described on the [Installing dependencies for some community packages](/getting-started/dependencies-for-some-community-packages/#macos) page.

You can run `xcode-select --install` to setup these build tools if you think they’re not already present. You _do not_ need a full installation of Xcode.

@tab Windows

Install all of the components described on the [Installing dependencies for some community packages](/getting-started/dependencies-for-some-community-packages/#installing-visual-studio-tools) page.

In particular, you must have either Visual Studio or Visual Studio Tools (_not_ Visual Studio Code) and the “Desktop development with C++” component must be enabled.

:::

## Building and running the application

To build the application so you can start hacking on the core you will need to download the source code to your local machine and `cd` to the pulsar directory:

```sh
git clone https://github.com/pulsar-edit/pulsar.git && cd pulsar
```

Install Node (we recommend using `nvm`; see above) and enable corepack (for `yarn`). This will install the version of Node specified in [pulsar/.nvmrc](https://github.com/pulsar-edit/pulsar/blob/master/.nvmrc):

```sh
nvm install
corepack enable
```

If Node is already installed, run the following to make sure the correct version of Node is being used (see [requirements](#requirements-and-dependencies)):

```sh
nvm use
node -v
```

Run the following to initialize and update the submodules:

```sh
git submodule init && git submodule update
```

Now install and build Pulsar & `ppm`:

```sh
yarn install
yarn build
yarn build:apm
```

Start Pulsar!

```sh
yarn start
```

These instructions will also build `ppm` (Pulsar Package Manager) but it will require some [additional configuration](/contributing-to-pulsar/using-ppm/) for use.

## Building binaries

The following will allow you to build Pulsar as a stand alone binary or installer. After running you will find your built application in `pulsar/binaries`.

The build script will automatically build for your system’s CPU architecture. For example, building on an `x86_64` CPU will produce binaries for `x86_64`, and building on `arm64` will only produce binaries for `arm64`.

It is not possible to “cross-build” for different OSes. For Linux binaries you must build from a Linux machine; macOS binaries must be built from macOS; and so on. Your OS is detected automatically and the script will build the correct binaries for it.

::: tabs#core-hacking

@tab Linux

By default, running `yarn dist` will attempt to create `AppImage` (for most Linux distributions), `deb` (for Debian or Ubuntu based distributions) and `rpm` (for Red Hat or Fedora based distributions) binaries but you can select the actual target you want to build by appending the above targets to the command. e.g.:

- `yarn dist appimage`
- `yarn dist deb`
- `yarn dist rpm`
- `yarn dist targz`

@tab macOS

`yarn dist` will create a `dmg` installer. There are currently no additional targets for macOS.

As noted above this builds for your current CPU architecture. On an Intel Mac this will create Intel binaries; on Apple silicon (M1, M2, etc.) this will create Apple silicon binaries.

@tab Windows

By default, running `yarn dist` will attempt to create an `NSIS` installer as well as a `Portable` executable which does not require installation. If you only wish to build one then you can specify it by appending the above targets to the command e.g.:

- `yarn dist nsis`
- `yarn dist portable`

:::
