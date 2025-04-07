---
title: Using PPM (Pulsar Package Manager)
layout: doc.ejs
---

<!-- TODO: This language is rewritten to hedge a bit more just so we can remove the “information may be outdated!” scare text from the title. This still needs further investigation. -->

`ppm` is used for installing and managing Pulsar’s packages in much the same way that `apm` did on Atom.

If you build Pulsar from source following the build instructions, you will find the `ppm` binary at `pulsar/ppm/bin/ppm`. This should be usable out of the box, but in some unusual scenarios you might find that you have to set some environment variables:

::: tabs#core-hacking

@tab Linux

```sh
export ATOM_HOME=/home/<user>/.pulsar
export APM_PATH=<absolute path to your ppm binary>
export ATOM_ELECTRON_VERSION=12.2.3
```

@tab macOS

```sh
export ATOM_HOME=/Users/<user>/.pulsar
export APM_PATH=<absolute path to your ppm binary>
export ATOM_ELECTRON_VERSION=12.2.3
```

@tab Windows

```
set ATOM_HOME=C:\Users\<user>\.pulsar
set APM_PATH=<absolute path to your ppm binary>
set ATOM_ELECTRON_VERSION=12.2.3
```

:::

You can now use the binary to link or install packages.

For example, to install the `ide-java` package from source:

```sh
# clone the repository and cd into it
git clone https://github.com/pulsar-edit/ide-java
cd ide-java

# from the directory where you are running pulsar source code
<pulsar source>/ppm/bin/ppm link
```
