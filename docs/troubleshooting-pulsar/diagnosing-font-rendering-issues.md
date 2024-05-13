---
title: Diagnosing font rendering issues
layout: doc.ejs
---

You can determine which fonts are being used to render a specific piece of text by using the developer tools. To open the developer tools, press <kbd class="platform-linux platform-win">Ctrl+Shift+I</kbd><kbd class="platform-mac">Alt+Cmd+I</kbd>. Once the developer tools are open, click the "Elements" tab.

Use the [standard tools for finding the element](https://developers.google.com/web/tools/chrome-devtools/inspect-styles/) containing the text you want to check. Once you have selected the element, you can click the "Computed" tab in the styles pane and scroll to the bottom. The list of fonts being used will be shown there:

![Fonts In Use](/img/atom/fonts-in-use.png "Fonts In Use")
