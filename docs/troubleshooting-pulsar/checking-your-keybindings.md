---
title: Checking your keybindings
layout: doc.ejs
---

If a command is not executing when you press a key combination or the wrong command is executing, there might be an issue with the keybinding for that combination. Pulsar ships with the {keybinding-resolver} package; it helps you understand what key Pulsar saw you press and the command that was triggered because of it.

Show the keybinding resolver with <kbd class="platform-linux platform-win">Ctrl+.</kbd><kbd class="platform-mac">Cmd+.</kbd>, or with **Keybinding Resolver: Show** from the Command palette. With the keybinding resolver shown, press a key combination:

![Keybinding Resolver](/img/atom/keybinding-resolver.png)

The keybinding resolver shows you a list of keybindings that exist for the key
combination, where each item in the list has the following:

- the command for the keybinding
- the CSS selector used to define the context in which the keybinding is valid
- the file in which the keybinding is defined

The keybindings are listed in two colors. All the keybindings that are matched but not executed are shown in gray. The one that is executed, if any, is shown in green. If the command you wanted to trigger isn't listed, then a keybinding for that command hasn't been loaded.

If multiple keybindings are matched, Pulsar determines which keybinding will be executed based on the [specificity of the selectors and the order in which they were loaded](/behind-pulsar/keymaps-in-depth/#specificity-and-cascade-order). If the command you wanted to trigger is listed in the keybinding resolver, but wasn't the one that was executed, this is normally explained by one of two causes:

- **The key combination was not used in the context defined by the keybinding's selector.** For example, the {tree-view} package’s key bindings generally only have effect when the tree view is focused. If you want some of those keybindings to have effects when the focus is elsewhere, you’ll have to define them to apply more generally in your keymap file.

- **There is another keybinding that took precedence.** This often happens when you install a package which defines keybindings that conflict with existing keybindings. If the package's keybindings have selectors with higher specificity or were loaded later, they'll have priority over existing ones.

Pulsar loads core Pulsar keybindings and package keybindings first, and
user-defined keybindings last. Since user-defined keybindings are loaded last, they take precedence in the case of specificity ties. So if two of your packages are fighting over a certain key binding, you can break the tie via a tweak in your `keymap.cson`. See the [Keymaps in depth section](/behind-pulsar/keymaps-in-depth) for more information.

:::tip
Don’t forget, too, that any package’s keymap file can be disabled.

If you’re largely satisfied with the keybindings a package makes, but want to disable one or two, you can unset those key bindings in your keymap file.

On the other hand, if you are largely unsatisfied with a package’s keybindings, and want to ditch _most_ of them and keep only a couple, you should find the “Keybindings” heading on the package’s settings page and uncheck “Enable” to disable its keybindings.

The table below the “Enable” setting lists the package’s keybindings. If there are any you wish to preserve after you’ve disabled them, you can click on the “copy” icon next to the keystroke. Your clipboard will then contain a keymap definition you can paste into your `keymap.cson`.

<!-- TODO: Screenshot -->
:::

If you notice that a package's keybindings are taking precedence over core Pulsar keybindings, it might be a good idea to report the issue on that package's GitHub repository. You can contact Pulsar maintainers on [Pulsar's github discussions](https://github.com/orgs/pulsar-edit/discussions).
