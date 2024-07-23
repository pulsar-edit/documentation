---
title: Adding terminal commands
layout: doc.ejs
---

Pulsar has support for command-line invocation. For instance, you could `cd` into the directory where your project lives, then run `pulsar .` to open a window for the project.

It also allows you to manage your installed packages on the command line through a tool called `ppm`, or Pulsar Package Manager.

Depending on your platform, you might have to perform some steps before these commands will work in your shell.

## macOS

On macOS, shell commands won’t be installed automatically, but you can trigger their installation via _Pulsar > Install Shell Commands_. When you select this menu item, `pulsar` and `ppm` are symlinked to `/usr/local/bin`.

If, after installing shell commands, you can’t get your shell to recognize `pulsar` or `ppm`, inspect your `PATH` environment variable and make sure that `/usr/local/bin` is present.

## Linux

### `deb` and `rpm`

The `deb` and `rpm` distributions of Pulsar will automatically place `pulsar` and `ppm` in your path.

### `.tar.gz`

:::danger
_**TODO:** This section is aspirational, since `pulsar.sh` doesn’t yet support invocation from an arbitrary location on disk. On Linux it assumes that Pulsar always lives at `/opt/Pulsar`. This needs changing before these docs will be accurate._
:::

If you downloaded the `.tar.gz` version of Pulsar, you’ll find that it decompresses into a folder with a `pulsar` binary at its root. Launching this binary from the terminal will launch Pulsar.

:::info

For instance, if you were downloading Pulsar 1.119.0, here’s one strategy you could use:

* `tar xvzf Linux.pulsar-1.119.0.tar.gz` to extract the downloaded file;
* `mv pulsar-1.119.0 pulsar` to rename the resulting folder;
* `mv pulsar ~/` to move the folder into your user directory

You could repeat these steps whenever you download a new version of Pulsar, being sure to move or delete the old `~/pulsar` folder first.

:::

The proper way to use Pulsar from the shell is via a shell script called `pulsar.sh` that you’ll find inside the `resoures` folder of your extracted download. The `ppm` command exists inside a deeper folder within the tree.

Once you know where your Pulsar installation will live, you can symlink these scripts into a folder that exists in your `PATH`.

:::info

For instance, you could run the following commands to symlink `pulsar` and `ppm` to `/usr/local/bin`:

```
ln -s ~/pulsar/resources/pulsar.sh /usr/local/bin/pulsar
ln -s ~/pulsar/resources/app/ppm/bin/ppm /usr/local/bin/ppm
```

This assumes `/usr/local/bin` is on your `PATH` and that your Pulsar app lives at `~/pulsar`; you can change the commands accordingly for various origin and destination paths.

:::

### AppImage

The AppImage version of Pulsar works a bit differently. AppImages are self-contained files that can live anywhere on disk, much like macOS applications. To invoke that file in a terminal is equivalent to invoking the `pulsar` executable in other distributions.

If you’re using an AppImage, here are some suggestions to make it easier to launch Pulsar from the command line:

* **Rename the download.** When you download the AppImage distribution of Pulsar, the download file will have a name like `Linux.Pulsar.1.XXX.AppImage` (where XXX matches the minor version of the latest Pulsar release). For simplicity’s sake, it’s a good idea to rename this to something shorter, like `Pulsar.AppImage`. This also makes it easier to update Pulsar when new versions come out: rename to `Pulsar.AppImage`, then move it to your destination directory, overwriting the previous version.

* **Make sure it lives on your `PATH`.** It’s a good idea for your `AppImage` file to live in a directory that’s already on your `PATH` — or to add that directory to your `PATH` if it’s not already present. That allows you to invoke the command from anywhere on your system without specifying its full path. The AppImage documentation has suggestions on [where you could store your AppImages](https://docs.appimage.org/user-guide/faq.html#question-where-do-i-store-my-appimages).

Launching `ppm` is trickier, since that’s typically its own separate command. But you can instead use the `-p`/`--package` flag when launching Pulsar; when it’s present, the command will be routed to `ppm`.

If you follow the advice above, you will be able to launch Pulsar and `ppm` as follows:

* When you see `pulsar` in the docs, replace it with `Pulsar.AppImage`.
* When you see `ppm` in the docs, replace it with `Pulsar.AppImage -p`.

#### Using aliases for `pulsar` and `ppm`

But we can go further and use aliases to eliminate the difference altogether:

* Locate your shell’s startup file, or create one if it’s not present. This might be `.bashrc` or `.bash_profile` if your shell is `bash`, or `.zshrc` if your shell is `zsh`. The startup file typically lives in your home folder.
* Add these lines to your shell startup file:

    ```shell
    alias pulsar="Pulsar.AppImage"
    alias ppm="Pulsar.AppImage -p"
    ```

* Restart your shell and make sure your new aliases work:

    ```
    pulsar --version
    ppm --version
    ```


## Windows


:::danger
**TODO:** Certain parts of these instructions won’t work right until [#1054](https://github.com/pulsar-edit/pulsar/pull/1054) is landed.
:::

Windows installations of Pulsar can attempt to place `pulsar` and `ppm` in your path via the settings. Select _File > Settings_, choose the _System_ pane, and select “Add Pulsar to PATH.”

If this command runs properly, you should be set — but we’ll make sure in a second. If not, you’ll have to add them manually.

### Checking your path

Open a terminal application — Windows Terminal is available for free from the Microsoft Store, or you can use Windows’ built-in PowerShell — and run:

```
Get-Command pulsar
Get-Command ppm
```

If these commands are identified and point to paths within your Pulsar installation directory, you’re done. If not, keep reading.

### Manually modifying your path

:::tip
Before you attempt this, you should remind yourself where you installed Pulsar. If you installed it system-wide, for instance, its installation directory would’ve defaulted to `C:\Program Files\Pulsar`; but if you installed it for just the current user, it would’ve defaulted to `C:\Users\(my-user)\AppData\Local\Programs\pulsar`.

If you can’t remember where you installed it, check these two locations first.
:::

Right-click on your Windows start menu and choose _Settings_. In the window that opens, focus the search field, type `environment`, and choose “Edit the system environment variables.”

![system properties](/img/atom/system-properties.png)

You’ll be taken to the venerable System Properties dialog. Choose [[Environment Variables…]] and you’ll see a list of defined environment variables for both the user and the system.

![environment variables](/img/atom/environment-variables-list.png)

You may edit either your user `Path` or your system `Path`, but most people will probably want to edit their user `Path`. Click on that entry in the list and choose [[Edit…]].

You may add new lines to this list. Here’s what you should add:

* The path to `pulsar.cmd`: `[pulsar-installation-directory]\resources`.
* The path to `ppm.cmd`:  `[pulsar-installation-directory]\resources\app\ppm\bin`.

![system properties](/img/atom/environment-variables.png)

Click [[OK]] on a few windows until you’re back at the Settings app, then close and reopen your terminal application so that the new `PATH` setting takes effect. Now try [the commands from above](#checking-your-path) again. Both should resolve to paths that match what we put into `PATH` just now.

The final test is to run them:

```
pulsar --version
ppm --version
```

Both of these commands should produce output in your terminal.
