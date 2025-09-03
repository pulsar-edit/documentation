---
title: "Installing Pulsar"
layout: doc.ejs
---

To get started with Pulsar, you’ll need to get it on your system. This involves picking a release channel, then choosing a release that matches your operating system, processor architecture, and preferred format.

You can [download Pulsar](https://pulsar-edit.dev/download.html) from our web site.

## Release channels

There are [two release channels of Pulsar](https://pulsar-edit.dev/blog/20230216-Daeraxa-ReleaseStrategyUpdate.html) that vary only in the frequency of updates:

### Regular release

Roughly once per month, the Pulsar team increments Pulsar’s version number and issues a new release with everything that’s landed since the previous release. These are considered to be stable releases.

### Rolling release

The rolling release of Pulsar is bleeding-edge, containing the newest changes possible as soon as they are added to Pulsar. Every pull request that’s merged to Pulsar’s `master` branch results in a new rolling release being created automatically by our CI. For this reason, rolling releases do not occur on a set schedule.

The rolling release is equivalent to a “nightly” or “canary” release. They can sometimes deliver bug fixes faster than possible from regular releases, and they give the community a chance to provide feedback to changes before they become more widely available.

In rare cases they can also contain breaking changes that were not caught by the developers of Pulsar.

## Choosing a download

Pulsar is available for Windows, macOS, and Linux. Different versions are available for each OS and for both major processor architectures (x86 and ARM).

Various download formats are available depending on your operating system, too.

### Linux

#### Universal releases

Releases are provided in `.AppImage` and `.tar.gz` “universal” formats that should work on most Linux distributions.

##### AppImage

Simply run the Pulsar AppImage from your file manager or the terminal:

```bash
./pulsar_1.106.0_amd64.AppImage
```

For deeper integration into the system, consider using [AppImageLauncher](https://github.com/TheAssassin/AppImageLauncher).

##### tar.gz

Simply extract and run the `pulsar` binary or integrate it into your system manually.

#### Debian/Ubuntu based distributions

To install Pulsar on Debian, Ubuntu, or related distributions, download the `.deb` Pulsar binary.

You can install it by opening it in your file manager or via the terminal:

```bash
sudo apt install .pulsar_1.106.0_amd64.deb
```

#### Fedora/RHEL based distributions

To install Pulsar on Fedora, RHEL, or related distributions, download the `.rpm` Pulsar binary.

You can install this by opening it in your file manager or via the terminal:

```bash
# On DNF-based distributions
sudo dnf install -y ./pulsar_1.106.0_amd64.rpm

# On YUM-based distributions
sudo yum install -y ./pulsar_1.106.0_amd64.rpm
```

#### Officially supported package managers

Optionally, Pulsar can be installed from the following officially supported package manager systems for Linux:

  * [deb-get](https://github.com/wimpysworld/deb-get/blob/main/01-main/packages/pulsar)

#### Community-supported package managers

!!!include(_partial_docs/community-supported-package-manager-warning.md)!!!

Pulsar can be installed from many community-supported package manager systems for Linux:

  * [AUR](https://aur.archlinux.org/packages/pulsar-bin)
  * [GURU](https://github.com/gentoo/guru/tree/master/app-editors/pulsar-bin)
  * [Homebrew](https://formulae.brew.sh/cask/pulsar#default)
  * [FlatPak](https://flathub.org/apps/dev.pulsar_edit.Pulsar)
  * [Nixpkgs](https://search.nixos.org/packages?channel=unstable&show=pulsar)
  * [AM/AppMan](https://github.com/ivan-hc/AM-Application-Manager/blob/main/programs/x86_64/pulsar)

### macOS

Pulsar follows the standard macOS installation process. Grab the correct download `.dmg` for your system, ensuring to grab the macOS Intel, or macOS Silicon release as needed. Once you have the file, you can open it to run the installer and drag the new `Pulsar` application into your "Applications" folder.

You can choose a `.zip` download instead of a `.dmg`. This requires you to extract the file and drag the `Pulsar` application into your "Applications" folder.

#### Officially supported package managers

Unfortunately, there are no officially supported package managers for Pulsar installation on macOS at this time.

#### Community-supported package managers

!!!include(_partial_docs/community-supported-package-manager-warning.md)!!!

Pulsar can be installed from some community-supported package manager systems for macOS:

  * [Homebrew](https://formulae.brew.sh/cask/pulsar#default)


### Windows

Pulsar on Windows supports a standard installation as well as running Pulsar in “Portable Mode” (more on that below).

To install Pulsar regularly, download the `Setup` file, and double click to run. During the installation process, you’ll be able to choose either the default user install (just the current user) or a machine install (all users of the machine). A user install is recommended, but either one will work, though a machine install will require administrative privileges.

You’ll be asked whether the folders that contain the `pulsar` and `ppm` binaries should be added to your `PATH`. This is recommended; it will make it easier to [launch Pulsar from a terminal](/getting-started/terminal-commands/).

:::note

Pulsar’s Windows binaries are not signed. This means that you will get a Windows Defender popup telling you that it cannot verify that Pulsar is safe. This is expected. Unless you are on Windows S-Mode, or installation of unsigned apps has been disabled by the administrator, you can click on **More Info**, then **Run Anyway** to continue the installation.
:::

#### Officially supported package managers

Optionally, Pulsar can be installed from the following officially supported package manager systems for Windows:

  * [Chocolatey](https://community.chocolatey.org/packages/pulsar)

#### Community-supported package managers

!!!include(_partial_docs/community-supported-package-manager-warning.md)!!!

Optionally, Pulsar can be installed from some community-supported package manager systems for Windows:

  * [winget](https://winstall.app/apps/Pulsar-Edit.Pulsar)

## Updating Pulsar

You should update Pulsar periodically for the latest improvements to the software. This is useful for receiving bug fixes and new features, but especially for receiving ongoing fixes for possible security vulnerabilities.

Pulsar does not automatically update itself, but it includes a package called {pulsar-updater} that can notify you when a new version is available:

* If you downloaded a regular release from the website, it will notify you when the next regular release is available.
* If you downloaded a rolling release from the website, it will notify you when the next rolling release is available.
* If you downloaded Pulsar from an officially supported package manager, it will notify you when that package manager has received a new version.

You’re free to ignore this message until the next launch of Pulsar, or ask not to be reminded until the next release. You can also control this behavior in the `pulsar-updater` settings, or else disable the package entirely if you don’t like the reminders.

## Portable mode

Pulsar can optionally be run in a “portable” mode that allows it to be used without previous installation.

Pulsar typically stores its configuration and state in a `.pulsar` directory usually located in your home directory <span class="platform-mac platform-linux">(`~`)</span><span class="platform-win">(`%UserProfile%` on Windows)</span>. In portable mode, though, Pulsar stores its configuration data alongside the app. This allows the app to be run in a self-contained way from a location like a network share or a removable storage device.

To setup Pulsar in portable mode, follow the directions for your platform:

### Linux

Download the `.AppImage` or `.tar.gz` release, then create a `.pulsar` directory alongside the directory that contains the Pulsar binary. For example:

```
/media/myusb/pulsar-1.106.0/.pulsar
/media/myusb/.pulsar
```

### macOS

Download the `.zip` release, then create a `.pulsar` directory alongside the `Pulsar.app` application. For example:

```
/MyUSB/Pulsar.app
/MyUSB/.pulsar
```

### Windows

Download the `Portable` release, then create a `.pulsar` directory alongside the directory that contains `Pulsar.exe`. For example:

```
E:\pulsar-1.106.0\Pulsar.exe
E:\.pulsar
```

### Portable install notes

  * The `.pulsar` directory must be writeable.
  * You can move an existing `.pulsar` directory to your portable device.
  * Pulsar can also store its Electron user data in your `.pulsar` directory - just create a subdirectory called `electronUserData` inside `.pulsar`.
  * Alternatively you can set the `ATOM_HOME` environment variable to point wherever you want (you can write a `.sh` or `.cmd` script to temporarily set it and launch it from that).
  * Users of portable mode on Windows will be notified of updates via {pulsar-updater}. For portable mode on other platforms, Pulsar will not (yet) notify the user of newer versions.
