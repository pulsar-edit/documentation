---
title: Adding terminal commands
layout: doc.ejs
---

It’s useful to be able to invoke `pulsar` or `ppm` within your terminal. Depending on your platform, though, you might have to take some steps to make this possible.

## macOS

On macOS, shell commands won’t be installed automatically, but you can trigger their installation via _Pulsar > Install Shell Commands_. When you select this menu item, `pulsar` and `ppm` are symlinked to `/usr/local/bin`.

If, after installing shell commands, you can’t get your shell to recognize `pulsar` or `ppm`, inspect your `PATH` environment variable and make sure that `/usr/local/bin` is present.

## Linux

Linux distributions of Pulsar will automatically place `pulsar` and `ppm` in your path.

## Windows

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

Right-click on your Windows start menu and choose _Settings_. In the window that opens, focus the search field, type `environment`, and choose “Edit the system environment variables.”

![system properties](/img/atom/system-properties.png)

You’ll be taken to the venerable System Properties dialog. Choose [[Environment Variables…]] and you’ll see a list of defined environment variables for both the user and the system.

![environment variables](/img/atom/environment-variables.png)

You may edit either your user `Path` or your system `Path`, but most people will probably want to edit their user `Path`. Click on that entry in the list and choose [[Edit…]].

You may add new lines to this list. Here’s what you should add:

* The path where you installed Pulsar; by default, this will be `C:\Program Files\Pulsar`.
* The path to `ppm` within your Pulsar installation; by default, this will be `C:\Program Files\Pulsar\resources\app\ppm\bin`. (If the first entry points to a different directory, this entry should point to that same directory, but with `\resources\app\ppm\bin` added.)

![path entries](/img/atom/path-entries.png)

Click [[OK]] on a few windows until you’re back at the Settings app, then close and reopen your terminal application so that the new `PATH` setting takes effect. Now try [the commands from above](#checking-your-path) again. Both should resolve to paths that match what we put into `PATH` just now.

The final test is to run them:

```
pulsar --version
ppm --version
```

Both of these commands should produce output in your terminal.
