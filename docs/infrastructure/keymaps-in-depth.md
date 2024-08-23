---
title: Keymaps in-depth
layout: doc.ejs
---

## Structure of a keymap file

Keymap files are encoded as JSON or CSON files containing nested hashes. They work much like style sheets, but instead of applying style properties to elements matching the selector, they specify the meaning of keystrokes on elements matching the selector. Here is an example of some bindings that apply when keystrokes pass through `atom-text-editor` elements:

::: tabs#behind-pulsar

@tab Linux

```coffee
'atom-text-editor':
  'ctrl-left': 'editor:move-to-beginning-of-word'
  'ctrl-right': 'editor:move-to-end-of-word'
  'ctrl-shift-left': 'editor:select-to-beginning-of-word'
  'ctrl-shift-right': 'editor:select-to-end-of-word'
  'ctrl-backspace': 'editor:delete-to-beginning-of-word'
  'ctrl-delete': 'editor:delete-to-end-of-word'

'atom-text-editor:not([mini])':
  'ctrl-alt-[': 'editor:fold-current-row'
  'ctrl-alt-]': 'editor:unfold-current-row'
```

@tab Mac

```coffee
'atom-text-editor':
  'cmd-delete': 'editor:delete-to-beginning-of-line'
  'alt-backspace': 'editor:delete-to-beginning-of-word'
  'ctrl-A': 'editor:select-to-first-character-of-line'
  'ctrl-shift-e': 'editor:select-to-end-of-line'
  'cmd-left': 'editor:move-to-first-character-of-line'

'atom-text-editor:not([mini])':
  'cmd-alt-[': 'editor:fold-current-row'
  'cmd-alt-]': 'editor:unfold-current-row'
```

@tab Windows

```coffee
'atom-text-editor':
  'ctrl-left': 'editor:move-to-beginning-of-word'
  'ctrl-right': 'editor:move-to-end-of-word'
  'ctrl-shift-left': 'editor:select-to-beginning-of-word'
  'ctrl-shift-right': 'editor:select-to-end-of-word'
  'ctrl-backspace': 'editor:delete-to-beginning-of-word'
  'ctrl-delete': 'editor:delete-to-end-of-word'

'atom-text-editor:not([mini])':
  'ctrl-alt-[': 'editor:fold-current-row'
  'ctrl-alt-]': 'editor:unfold-current-row'
```

:::

Beneath the first selector are several keybindings, mapping specific key combinations to commands. When an element with the `atom-text-editor` class is focused and <kbd class="platform-linux platform-win">Ctrl+Backspace</kbd> <kbd class="platform-mac">Alt+Backspace</kbd> is pressed, a custom DOM event called `editor:delete-to-beginning-of-word` is emitted on the `atom-text-editor` element.

The second selector group also targets editors, but only if they don't have the `mini` attribute. In this example, the commands for code folding don't really make sense on mini-editors, so the selector restricts them to regular editors.

### Key combinations

Key combinations express one or more keys combined with optional modifier keys. For example: `ctrl-w`, or `cmd-shift-up`. A key combination is composed of the following symbols, separated by a `-`. A key sequence can be expressed as key combinations separated by spaces.

| Type               | Examples                                                                                                        |
| :----------------- | :-------------------------------------------------------------------------------------------------------------- |
| Character literals | `a` `4` `$`                                                                                                     |
| Modifier keys      | `cmd` `ctrl` `alt` `shift`                                                                                      |
| Special keys       | `enter` `escape` `backspace` `delete` `tab` `home` `end` `pageup` `pagedown` `left` `right` `up` `down` `space` |

### Commands

Commands are implemented as custom DOM events that are triggered when a key combination or sequence matches a binding. This allows user interface code to listen for named commands without coupling themselves to the specific keybinding that triggers it.

For example, the following code creates a command to insert the current date in an editor:

```js
atom.commands.add("atom-text-editor", {
	"user:insert-date": function (event) {
		const editor = this.getModel();
		return editor.insertText(new Date().toLocaleString());
	},
});
```

`atom.commands` refers to the global {CommandRegistry} instance where all commands are set and consequently picked up by the command palette.

When you are looking to bind new keys, it is often useful to use the command palette (<kbd class="platform-linux platform-win">Ctrl+Shift+P</kbd><kbd class="platform-mac">Cmd+Shift+P</kbd>) to discover what commands are being listened for in a given focus context. Command names are “humanized” following a simple algorithm, so a command like `editor:fold-current-row` would appear as **Editor: Fold Current Row**.

### “Composed” commands

A common question is, “How do I make a single keybinding execute two or more commands?” There isn't any direct support for this in Pulsar, but it can be achieved by creating a custom command that performs the multiple actions you desire and then creating a keybinding for that command.

For example, let’s say I want to create a “composed” command that performs a **Select Line** followed by **Cut**. I could add the following to my `init.js`:

```js
atom.commands.add("atom-text-editor", "custom:cut-line", function () {
	const editor = this.getModel();
	editor.selectLinesContainingCursors();
	editor.cutSelectedText();
});
```

And if I wanted to map this custom command to `alt-ctrl-z`, I could add the following to my keymap:

```coffee
'atom-text-editor':
  'alt-ctrl-z': 'custom:cut-line'
```

### Specificity and cascade order

As is the case with CSS applying styles, when multiple bindings match for a single element, the conflict is resolved by choosing the most _specific_ selector. If two matching selectors have the same specificity, the binding for the selector appearing later in the cascade takes precedence.

Currently, there's no way to specify selector ordering within a single keymap, because JSON objects do not preserve order. We handle cases where selector ordering is critical by breaking the keymap into separate files.

For instance, the {snippets} package defines two keymap files: `snippets-1.cson` and `snippets-2.cson`. It does this because it binds two different commands to the [[Tab]] key, and it’s critical that one of those bindings is processed before the other.

### Targeting specific grammars

If a keybinding should only apply to a specific grammar, you can limit bindings to that grammar using the `data-grammar` attribute on the `atom-text-editor` element:

```coffee
"atom-text-editor[data-grammar='source example']":
  'ctrl-.': 'custom:custom-command'
```

This works because the segments of the root scope name for the grammar (`.source.example` in this example) are split and written to the text editor at the `data-grammar` attribute.

This is a simple technique, but it cannot be applied to scopes defined within the grammar or to sub-elements of `atom-text-editor`. That’s because all commands invoked while focus is inside a text editor are dispatched on the `atom-text-editor` element.

Since the root key is just a CSS selector, it can use any CSS combinator or operator. For instance, you can use the following syntax to write a keybinding that applies to HTML and PHP files alike (whose root scopes are `.text.html.basic` and `.text.html.php`, respectively):

```coffee
"atom-text-editor[data-grammar^='text html']":
  'ctrl-.': 'custom:custom-command'
```

You can even join several disparate grammars together in the same selector with commas, just as you would in a stylesheet:

```coffee
"atom-text-editor[data-grammar='source js'], atom-text-editor[data-grammar='text html basic']":
  'ctrl-.': 'custom:custom-command'
```

## Removing bindings

When the keymap system encounters a binding with the `unset!` directive as its command, it will treat the current element as if it had no key bindings matching the current keystroke sequence and continue searching from its parent. For example, the following code removes the keybinding for [[a]] in the tree view, which is normally used to trigger the `tree-view:add-file` command:

```coffee
'.tree-view':
  'a': 'unset!'
```

![Keybinding Resolver](/img/atom/keybinding.png)

This removes the specific binding that the {tree-view} package makes for this command. But it doesn’t explicitly force [[a]] to do _nothing_ when focus is inside of a tree view. For instance, if a different package bound [[a]] to a particular function in `atom-workspace`, that keybinding could still execute once `tree-view:add-file` is unset, since the event will keep propagating upward.

By contrast, when the keymap system encounters a binding with the `abort!` directive as its command, it will stop searching for a keybinding. For example, the following code removes the keybinding for <kbd class="platform-linux platform-win">Ctrl+O</kbd> <kbd class="platform-mac">Cmd+O</kbd> when the selection is inside an editor pane:

::: tabs#behind-pulsar

@tab Linux

```coffee
'atom-text-editor':
  'ctrl-o': 'abort!'
```

@tab Mac

```coffee
'atom-text-editor':
  'cmd-o': 'abort!'
```

@tab Windows

```coffee
'atom-text-editor':
  'ctrl-o': 'abort!'
```

:::

This works even though that shortcut’s binding to `application:open` is defined on the `body` tag — `abort!` functions as an alias for a function that “swallows” the event.

But it won’t abort the binding when focus isn’t inside an `atom-text-editor`. For instance, if you move focus to a tree view and press <kbd class="platform-linux platform-win">Ctrl+O</kbd><kbd class="platform-mac">Cmd+O</kbd>, it’ll invoke `application:open` as it did before.

## Forcing Chromium’s native keystroke handling

If you want to force the native browser behavior for a given keystroke, use the `native!` directive as the command of a binding. This can be useful to enable the correct behavior in native input elements.

Or, if you’re building an interface in a community package, you can apply the `native-key-bindings` class name to an element; while focus is inside that element, all the keystrokes typically handled by the browser will be assigned the `native!` directive.

::: tip

**Tip:** Components and input elements may not correctly handle backspace and arrow keys without forcing this behavior. If your backspace isn't working correctly inside of a component, add either the directive or the `native-key-bindings` class name.

:::

## Overloading key bindings

Occasionally, it makes sense to layer multiple actions on top of the same key binding.

An example of this happens in the {snippets} package. Snippets are inserted by typing a snippet prefix such as `for` and then pressing [[Tab]]. Every time [[Tab]] is pressed, we want to execute code attempting to expand a snippet if one exists for the text preceding the cursor. But if a snippet _doesn't_ exist for that prefix, we want to revert to the typical behavor for tab [[Tab]] – inserting a tab character.

To achieve this, the snippets package makes use of the `.abortKeyBinding()` method on the event object representing the `snippets:expand` command.

```js
// pseudo-code
editor.command("snippets:expand", (e) => {
	if (this.cursorFollowsValidPrefix()) {
		this.expandSnippet();
	} else {
		e.abortKeyBinding();
	}
});
```

When the event handler in the {snippets} package observes that the cursor does not follow a valid snippet prefix, it calls `e.abortKeyBinding()`, telling the keymap system to continue searching for another matching binding.

## Step-by-step: how keydown events are mapped to commands

- A keydown event occurs on a _focused_ element.
- Starting at the focused element, the keymap walks upward towards the root of
  the document, searching for the most specific CSS selector that matches the
  current DOM element and also contains a keystroke pattern matching the keydown
  event.
- When a matching keystroke pattern is found, the search is terminated and the
  pattern's corresponding command is triggered on the current element.
- If `.abortKeyBinding()` is called on the triggered event object, the search
  is resumed, triggering a binding on the next-most-specific CSS selector for
  the same element or continuing upward to parent elements.
- If no bindings are found, the event is handled by Chromium normally.

## Overriding Pulsar’s keyboard layout recognition

Sometimes the problem isn’t mapping the command to a key combination — but rather that Pulsar doesn't properly interpret which keys you’re pressing. This is due to [some limitations in how Chromium reports keyboard events](https://web.archive.org/web/20220729003828/https://blog.atom.io/2016/10/17/the-wonderful-world-of-keyboards.html). But even this can be customized now.

For instance, you can add the following to your `init.js` to send [[Ctrl+@]] when
you press [[Ctrl+Alt+G]]:

```js
atom.keymaps.addKeystrokeResolver(({ event }) => {
	if (
		event.code === "KeyG" &&
		event.altKey &&
		event.ctrlKey &&
		event.type !== "keyup"
	) {
		return "ctrl-@";
	}
});
```

Or if you are still using the `init.coffee` file:

```coffee
atom.keymaps.addKeystrokeResolver ({event}) ->
  if event.code is 'KeyG' and event.altKey and event.ctrlKey and event.type isnt 'keyup'
    return 'ctrl-@'
```

If you want to know the `event` for the keystroke you pressed, you can paste the following script into your [developer tools console](/debugging-pulsar/check-for-errors-in-developer-tools/):

```js
document.addEventListener("keydown", (e) => console.log(e), true);
```

This will print every keypress event in Pulsar to the console so you can inspect `KeyboardEvent.key` and `KeyboardEvent.code`.
