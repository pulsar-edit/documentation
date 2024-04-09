---
title: Check your keybindings
layout: doc.ejs
---

If a command is not executing when you press a key combination or the wrong
command is executing, there might be an issue with the keybinding for that
combination. Pulsar ships with the [Keybinding Resolver](https://github.com/pulsar-edit/keybinding-resolver),
a neat package which helps you understand what key Pulsar saw you press and the
command that was triggered because of it.

Show the keybinding resolver with <kbd class="platform-linux platform-win">Ctrl+.</kbd> <kbd class="platform-mac">Cmd+.</kbd>, or with `Keybinding Resolver: Show` from the Command palette. With the Keybinding Resolver shown, press a key combination:

![Keybinding Resolver](/img/atom/keybinding-resolver.png)

The Keybinding Resolver shows you a list of keybindings that exist for the key
combination, where each item in the list has the following:

- the command for the keybinding
- the CSS selector used to define the context in which the keybinding is valid
- the file in which the keybinding is defined

The keybindings are listed in two colors. All the keybindings that are matched
but not executed are shown in gray. The one that is executed, if any, is shown
in green. If the command you wanted to trigger isn't listed, then a keybinding
for that command hasn't been loaded.

If multiple keybindings are matched, Pulsar determines which keybinding will be
executed based on the
[specificity of the selectors and the order in which they were loaded](../../behind-pulsar/#specificity-and-cascade-order).
If the command you wanted to trigger is listed in the Keybinding Resolver, but
wasn't the one that was executed, this is normally explained by one of two
causes:

- **The key combination was not used in the context defined by the keybinding's selector.** For example, you can't trigger the keybinding for the `tree-view:add-file` command if the Tree View is not focused.

- **There is another keybinding that took precedence.** This often happens when you install a package which defines keybindings that conflict with existing keybindings. If the package's keybindings have selectors with higher specificity or were loaded later, they'll have priority over existing ones.

Pulsar loads core Pulsar keybindings and package keybindings first, and
user-defined keybindings last. Since user-defined keybindings are loaded last,
you can use your `keymap.cson` file to tweak the keybindings and sort out
problems like these. See the [Keymaps in Depth section](/behind-pulsar/keymaps-in-depth)
for more information.

If you notice that a package's keybindings are taking precedence over core
Pulsar keybindings, it might be a good idea to report the issue on that
package's GitHub repository. You can contact Pulsar maintainers on
[Pulsar's github discussions](https://github.com/orgs/pulsar-edit/discussions).
