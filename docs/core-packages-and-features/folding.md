---
title: Folding
layout: doc.ejs
---

If you want to see an overview of the structure of the code file you’re working on, folding can be a helpful tool. Folding hides blocks of code such as functions or looping blocks in order to simplify what is on your screen.

You can fold blocks of code by clicking the arrows that appear when you hover your mouse cursor over the gutter. You can also fold and unfold from the keyboard with the <kbd class="platform-linux platform-win">Alt+Ctrl+\[</kbd><kbd class="platform-mac">Alt+Cmd+\[</kbd> and <kbd class="platform-linux platform-win">Alt+Ctrl+\]</kbd><kbd class="platform-mac">Alt+Cmd+\]</kbd> keybindings. These correspond to the **Editor: Fold/Unfold Current Row** commands.

![Code folding example](/img/atom/folding.png "Code folding example")

To fold everything, use <kbd class="platform-linux platform-win">Alt+Ctrl+Shift+\[</kbd><kbd class="platform-mac">Alt+Cmd+Shift+\[</kbd> and to unfold everything use <kbd class="platform-linux platform-win">Alt+Ctrl+Shift+\]</kbd><kbd class="platform-mac">Alt+Cmd+Shift+\]</kbd>. You can also fold at a specific indentation level with <span class="platform-linux platform-win"><kbd>Ctrl+K</kbd> <kbd>Ctrl+1-9</kbd></span> <span class="platform-mac"><kbd>Cmd+K</kbd> <kbd>Cmd+1-9</kbd></span> where the number is the indentation depth. These correspond to the **Editor: Fold/Unfold All** and **Editor: Fold at Indent Level X** commands (where X is a number from 1 to 9).

Finally, you can fold arbitrary sections of your code or text by making a selection and then typing <kbd class="platform-linux platform-win">Alt+Ctrl+F</kbd> <kbd class="platform-mac">Alt+Cmd+Ctrl+F</kbd> or choosing **Editor: Fold Selection** in the Command Palette.

Folding is a core feature.
