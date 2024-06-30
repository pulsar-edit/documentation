---
title: The init file
layout: doc.ejs
---

::: info
The default init file for Pulsar has been changed from the previous CoffeeScript `init.coffee` file used by Atom to JavaScript. You are still able to use an old `init.coffee` file — and even create a new one for use instead of `init.js`.

Should you wish to reference the specific version of this document for CoffeeScript, you can find it in the [Atom Archive](TODO).
:::

When Pulsar finishes loading, it will evaluate `init.js` in your <span class="platfom-linux platform-mac">`~/.pulsar`</span> <span class="platform-win">`%USERPROFILE%\.pulsar`</span> directory, giving you a chance to run JavaScript code to make customizations. Code in this file has full access to [Pulsar’s API](/api/pulsar/latest). If customizations become extensive, consider creating a package, which we will cover in [Package: Word count](/developing-for-pulsar/package-word-count/).

You can open the `init.js` file in an editor from the <span class="platform-linux">_Atom > Init Script_</span><span class="platform-mac">_File > Init Script_</span><span class="platform-win">_Edit > Init Script_</span> menu.

For example, if you have the Audio Beep configuration setting enabled, you could add the following code to your `init.js` file to have Pulsar greet you with an audio beep every time it loads:

```js
atom.beep();
```

Because `init.js` provides access to Pulsar's API, you can use it to implement useful commands without creating a new package or extending an existing one. Here's a command which uses the {Selection} and {Clipboard} APIs to construct a Markdown link from the selected text and the clipboard contents as the URL:

```js
atom.commands.add("atom-text-editor", "markdown:paste-as-link", () => {
	let clipboardText, editor, selection;
	if (!(editor = atom.workspace.getActiveTextEditor())) {
		return;
	}
	selection = editor.getLastSelection();
	clipboardText = atom.clipboard.read();
	return selection.insertText(
		"[" + selection.getText() + "](" + clipboardText + ")"
	);
});
```

:::tip
Other sorts of customizations can be applied without relaunching or reloading Pulsar — but not the init file, which requires a window reload to take effect.

That’s because there’s no way to undo the side effects of the _previous_ execution of the init file — the one that happened when you first loaded your current window.

You can reload pulsar with the **Window: Reload** command.
:::

Once you’ve saved your init file and reloaded Pulsar, use the [command palette](../../using-pulsar/basics/#command-palette) to execute the new command, **Markdown: Paste as Link**, by name. And if you'd like to trigger the command via a keyboard shortcut, you can define a [keybinding for the command](../customizing-keybindings).

:::tip
Since a command name takes the format `foo:bar`, where `foo` is typically the package name, you might wonder what value to use before the colon if you define commands in your init file.

It’s up to you! All that matters is that the command name not conflict with any other command name that may be defined. Consider using `custom` or your first name.
:::
