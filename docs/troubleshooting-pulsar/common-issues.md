---
title: Common issues
layout: doc.ejs
---

## macOS error: “_App is damaged and can’t be opened_”

The binary is likely from before macOS binaries started being signed. A up-to-date and signed binary may be downloaded from [the download page](/download.html). The unsigned binary can be made to run by running `xattr -cr /Applications/Pulsar.app/` in the terminal. See [here](https://appletoolbox.com/app-is-damaged-cannot-be-opened-mac/) for more information.

## Pulsar does not launch on Linux: “_GPU process isn't usable. Goodbye_”

You may need to launch the application with the argument `--no-sandbox` to get around this issue. This is something [under investigation](https://github.com/pulsar-edit/pulsar/issues/174).

## Linux error: TypeError: Unable to watch path

If you’re on Linux and you get the following error soon after Pulsar starts…

```
TypeError: Unable to watch path
```

…you might need to increase the maximum number of watched files allowed by `inotify`.

To test this theory, run

```sh
sudo sysctl fs.inotify.max_user_watches=32768
```

and restart Pulsar.

If Pulsar now works fine, you can make this setting permanent:

```sh
echo 32768 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
```
