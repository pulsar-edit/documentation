---
title: Terminal
layout: doc.ejs
---

What’s a development environment without a terminal? If you prefer to have your terminal nearby instead of in another application, you can use the built-in terminal provided by the {terminal} package.

![Screenshot of the terminal package](/img/atom/terminal-bottom-dock.png)

The built-in terminal has all the features you’d expect:

* It can live anywhere in your workspace: one of the center pane containers, or any of the docks to the bottom, left, or right.
* You can open any number of different terminals for different purposes.
* Terminals have sensible defaults for your platform. If you’re on Linux or macOS, by default the terminal will spawn your system shell — be it `bash`, `zsh`, `fish`, or something more exotic. If you’re on Windows, the terminal will default to PowerShell if it’s available, and battle-tested `cmd.exe` if it isn’t. And if you prefer something other than the default, you can explicitly specify your desired shell in the package settings.
* Terminals use color schemes that are designed to harmonize with the color scheme of your syntax theme. But you’re still able to choose a different theme, or else override one or more colors in targeted fashion.
* A terminal can be created or brought to the foreground with a simple keystroke.
* Terminals will automatically adjust to fit the dimensions of their container. If you resize a terminal’s pane container, the terminal’s output will adjust to its new size.
* You can search the terminal buffer for text with the same keybindings you’re used to using to search through editor buffers.
* Any URLs written to the terminal output can be clicked on. They’ll open in your default web browser!

<figure>
  <div>
    <img src="/img/atom/terminal-syntax-theme-matching.png" alt="terminal screenshot">
  </div>
  <figcaption>All built-in syntax themes declare their own terminal color schemes to match.</figcaption>
</figure>


## Keybindings

The default keybindings for the `terminal` package aim to make it easy to summon a terminal:

* Press <kbd>Ctrl+\`</kbd> to focus the terminal, or create a new terminal if one does not yet exist.
* Press <kbd>Ctrl+~</kbd> — which, on US QWERTY keyboard layouts, is the same as <kbd>Ctrl+Shift+\`</kbd> — to start a [key sequence](/using-pulsar/basics/#key-sequence). After starting the sequence, you can press one of a handfull of other keys to perform various tasks:
  * Press <kbd>n</kbd> to spawn a new terminal in the default location, even if one already exists.
  * Press an arrow key to split the workspace and spawn a new terminal at the same time. For instance, <kbd>Ctrl+~</kbd> <kbd>→</kbd> will split the active workspace area, create a new pane container to the right of the active container, and put a new terminal in that new pane container.
  * Presss <kbd>x</kbd> to take the selected text in the active editor and run it as a terminal command — or <kbd>i</kbd> to insert the text into the active terminal without running it.

The full set of keybindings can be seen on the package’s configuration page or in the package README.

::: warning

**Note:** If your keyboard layout is not US QWERTY, you might find these bindings awkward, since they likely won’t map to the key above <kbd>Tab</kbd> and to the left of <kbd>1</kbd>.

Eventually, we plan to allow keybindings to be defined in layout-independent fashion (targeting a key rather than the symbol a key produces) — but for now, we’d encourage users of other keyboard layouts to [remap these keybindings](/customizing-pulsar/customizing-keybindings/) to suit their own tastes.

:::

## Keyboard handling

Terminal emulators like to handle their own keyboard input. This can lead to surprising behavior, since Pulsar generally expects to be able to handle keyboard events. While the terminal is focused, you may press a certain key combination intending to invoke a Pulsar command… yet discover you performed an unintended action within the terminal instead!

The most reliable way to avoid this is to unfocus the terminal (by pressing <kbd>Ctrl+\`</kbd> when the terminal is in focus) before invoking your keybinding. But this is annoying! So for certain commands, we bypass this requirement. Here are the commands whose bindings Pulsar will handle _instead of_ letting the terminal handle the binding:

* Any binding defined by the `terminal` package itself.
* Any binding that begins with `pane:` (since pane management keybindings are designed to work anywhere in the workspace).

In the near future we’ll open up this list to customization so that you can specify _additional_ commands whose bindings should take precedence over the terminal’s bindings in the event of a conflict.


## URL handling

If a URL is present in your terminal’s buffer output, you can click on that URL to open it in your default web browser.

By default, it requires more than just clicking on the URL — you must hold the <kbd class="platform-mac">Cmd</kbd><kbd class="platform-win platform-linux">Ctrl</kbd> key while clicking. This is meant to prevent accidental clicks. If you prefer, you can disable this behavior in the {terminal} package’s settings.
