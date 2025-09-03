---
title: "IDE features provided by builtin packages"
layout: doc.ejs
---

So far we’ve told you how to install an IDE package for a given language — the “brain” that knows how to deliver lots of IDE features. But brains can’t do anything by themselves. What does the brain talk to? How do you use the features themselves?

For various reasons, some of these IDE features are provided by built-in packages, and others require additional community packages to enable. First, let’s talk about the built-in packages, and the features you get for free without further installation.

::: tip

If any of the features described below do not work, revisit the README file for your IDE package and ensure you’ve configured it properly. See the [troubleshooting](../troubleshooting) page for more information.

:::

## Autocompletion

We’ve learned that autocompletion is provided by the {autocomplete-plus} package. IDE packages use the `autocomplete.provider` [service](/infrastructure/interacting-with-other-packages-via-services/) to supply contextual autocompletion suggestions to the user.

Even where other autocompletion providers exist — like the built-in {autocomplete-html} and {autocomplete-css} — the autocompletion you get from an IDE package is likely to be more contextually aware and more useful.

<figure>
  <div>
    <img src="/img/atom/autocomplete-plus-language-server.png" alt="autocompletion via pulsar-ide-typescript">
  </div>
  <figcaption><p>In this example, <code>pulsar-ide-typescript</code> is able to offer us a contextual completion for this parameter type.</p></figcaption>
</figure>


## Symbol resolution

We briefly mentioned how you can [navigate through files by symbol](/using-pulsar/movement/#navigating-by-symbols). Those symbols could be a number of things depending on the kind of file: method names, CSS selectors, or Markdown heading names, to list a few examples.

This functionality is supplied by the built-in {symbols-view} package. Even without an IDE package, Pulsar allows you to navigate by symbols in most languages for the current file. (Since the file is already open, this isn’t hard!) But `symbols-view` also has the ability to jump to a symbol in a _different_ file, but not automatically; it needs something to tell it what those symbols are. A language server can do that very thing!

:::tip

Old IDE packages written for Atom don’t have this feature! You’ll need an IDE provider package _specifically written for Pulsar_. Pick one [from the list](../getting-started) or ensure it starts with `pulsar-ide-` instead of just `ide-`.

:::

An IDE package is especially useful for symbol resolution and lets you search for symbols on a _project-wide_ basis. For instance, the **Symbols View: Toggle Project Symbols** command (<kbd class="platform-mac">Cmd+Shift+R</kbd><kbd class="platform-linux platform-win">Ctrl+Shift+R</kbd> by default) will open a palette into which you can type the name of a symbol that may exist anywhere in your project.

<figure>
  <video controls>
    <source src="/img/atom/symbols-view-toggle-project-symbols.webm" type="video/webm">
    <a href=/img/atom/symbols-view-toggle-project-symbols.webm">Download as WebM</a>
  </video>
  <figcaption><p><strong>Symbols View: Toggle Project Symbols</strong> lets you search for symbols across the entire project.</p></figcaption>
</figure>


Even more powerful is the ability to jump to where a symbol is defined. Place your cursor inside the name of a function, then invoke the **Symbols View: Go To Declaration** command (<kbd class="platform-mac">Cmd+Alt+Down</kbd><kbd class="platform-linux platform-win">Ctrl+Alt+Shift+Down</kbd> by default) to jump to the declaration of that function!

But this isn’t a one-way trip: when you’re done consulting the function definition, you can invoke **Symbols View: Return From Declaration** (<kbd class="platform-mac">Cmd+Alt+Up</kbd><kbd class="platform-linux platform-win">Ctrl+Alt+Shift+Up</kbd> by default) to return to your previous location.

<figure>
  <video controls>
    <source src="/img/atom/symbols-view-go-to-declaration.webm" type="video/webm">
    <a href=/img/atom/symbols-view-go-to-declaration.webm">Download as WebM</a>
  </video>
  <figcaption><p><strong>Symbols View: Go To Declaration</strong> lets you jump to the place where a symbol is defined, no matter where it is in your project. <strong>Symbols View: Return From Declaration</strong> will return you to your original position.</p></figcaption>
</figure>

The list of locations you jump _from_ functions like a web browser’s history stack. For instance, you can jump three definitions deep, then invoke **Symbols View: Return From Declaration** three times in a row to go back to where you started.
