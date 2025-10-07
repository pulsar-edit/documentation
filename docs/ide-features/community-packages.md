---
title: "IDE features provided by community packages"
layout: doc.ejs
---

We [just showed you](../builtin-packages) a couple of features that you get for free without having to install any extra packages. Here are some others that are provided by community packages and are just a one-click install away.

::: info Why aren’t these packages bundled?

It depends! Here are a few reasons why:

* Some of them date back to Atom days and have historically been maintained by third parties. Occasionally, such packages would be “adopted” into the fold and become bundled, as happened with {autocomplete-plus} a long time ago; but in other cases, the package maintainer may have chosen to keep their package a community package for one reason or another.

* Some of these packages provide features that simply can’t be fulfilled with anything _except_ a language server, so by default they’d do nothing until the user installed an IDE package.

* Some of them may _eventually_ become built-in packages, but are comparatively new and still evolving.

:::

::: tip Not the only game in town

Some of the packages suggested below are common choices, but not the _only_ choice. Pulsar’s service-driven package architecture presents an opportunity here; since IDE packages communicate with UI packages via [services](/infrastructure/interacting-with-other-packages-via-services/), any UI package is interchangeable with any other package that consumes the same service.

Even built-in packages! If you didn’t like how {autocomplete-plus} did autocompletion, you could disable it and write your own version, and it’d be able to talk to the exact same autocompletion providers as `autocomplete-plus`. For this reason, the list below is a starting point, but it is not exhaustive!

:::

## Linting

Linting, otherwise known as code diagnostics, describes the process of flagging and annotating possible errors or mistakes in your code.

A linting interface is not built into Pulsar. The canonical packages for linting are {linter} and {linter-ui-default}; `linter` was the second-most-popular community package for Atom, with millions of installations, and still works quite well in Pulsar.

<figure>
  <div>
    <img src="/img/atom/linter.png" alt="linter screenshot">
  </div>
  <figcaption><p>The <code>linter</code> package shows diagnostic errors and warnings and may offer fixes.</p></figcaption>
</figure>


As is common with “UI” packages, the `linter` package does not do any code analysis on its own; it simply defines a system by which other packages can report code diagnostics. There are many, many packages out there that integrate into `linter` — not just IDE packages but also specialized code-linting tools. For this reason, you might already have `linter` installed!

Consider perusing the lists of packages that use [the `linter` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=linter) or [the `linter-indie` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=linter); this is another way to discover IDE packages.

:::note Consumers and Providers

You may have noticed that the `linter` package _consumes_ the `linter` service, but _provides_ the `linter-indie` service. What’s the difference?

A service sets up one or more dialogues between pairs of packages: one consumer and one provider. Whichever of the packages needs to _initiate_ communication tends to be the consumer.

In this case, the services’ differing designs are the reason. The `linter` service is a “pull” service and requires the UI to ask the provider for linting errors at a time of its own choosing. The `linter-indie` service is a “push” service; as code changes, a language server will detect potential diagnostic issues and notify the UI about them.

Nonetheless, this is an implementation detail that users usually won’t have to care about. All you need to know is that **providers** need to match up with **consumers** and _vice versa_.

In the Pulsar Package Registry, each package will list the services it consumes and provides. Clicking on a particular service in that list will show you search results for packages that fulfill the _opposite_ side of that service (and can therefore be paired with the original package).

:::

## Code actions

Language servers can do sophisticated analysis of your code and offer arbitrary options for refactors or fixes. Indeed, code actions and linting often go hand-in-hand; it’s common for a language server to both flag a possible error _and_ make suggestions on how to fix it.

If you’ve used Visual Studio Code, you may be familiar with [code actions](https://code.visualstudio.com/docs/editing/refactoring) already. In Pulsar, the equivalent feature is provided by the [`intentions` package](https://web.pulsar-edit.dev/packages/intentions); a user can invoke the **Intentions: Show** command to display suggestions for the code under the cursor.

<figure>
  <div>
    <img src="/img/atom/code-actions.png" alt="Code actions screenshot">
  </div>
  <figcaption><p>An <code>intentions</code> menu offering code actions to address the diagnostic error.</p></figcaption>
</figure>

You can pair up the `intentions` package with [a package that provides the `intentions:list` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=intentions:list).

## Code formatting

Language servers often have the ability to reformat code according to certain conventions and specifications.

For instance, `clangd` has the ability to format C and C++ code in [a number of different styles](https://clang.llvm.org/docs/ClangFormatStyleOptions.html). In turn, the {pulsar-ide-clangd} package provides services like `code-format.file`, `code-format.range`, and `code-format.onSave` to offer formatting of code in different scenarios: file-wide (on demand), for the selected range of code (on demand), and whenever you save (automatically).

<figure>
  <video controls>
    <source src="/img/atom/code-format.webm" type="video/webm">
    <a href=/img/atom/code-format.webm">Download as WebM</a>
  </video>
  <figcaption><p>Reformatting a region of the buffer via <code>pulsar-code-format</code>.</p></figcaption>
</figure>

In Pulsar, these can be used via {pulsar-code-format} and [an IDE package that supports `code-format.range`](https://web.pulsar-edit.dev/packages?serviceType=provided&service=code-format.range) or one of the other services listed above. ([Other code-formatting packages](https://web.pulsar-edit.dev/packages?serviceType=consumed&service=code-format.range) exist, too.)

## Highlighting references

IDEs are smart enough to identify “references” to a given token. Imagine putting your cursor within the name of a function you’ve written and having your editor highlight all other usages of that function — in the current buffer or other open buffers. Or asking “show me everywhere this function is used in my project” and seeing a list of usages presented in a style similar to project-wide find-and-replace.

<figure>
  <div>
    <img src="/img/atom/pulsar-find-references.png" alt="pulsar-find-references screenshot">
  </div>
  <figcaption><p>Using <code>pulsar-find-references</code>, other usages of <code>editorStyles</code> (the token under the cursor) are highlighted (and annotated in the scrollbar track).</p></figcaption>
</figure>


This can be done with {pulsar-find-references} and [an IDE package that supports the `find-references` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=find-references).

## Renaming symbols

Some people prefer language-specific IDEs over generalize text editors because they support powerful refactoring features — for instance, the ability to rename a function and have all other references to that function update in an intelligent manner across the entire project. Features like these are less error-prone than project-wide find-and-replace and allow developers to refactor code with more confidence.

<figure>
  <video controls>
    <source src="/img/atom/pulsar-refactor.webm" type="video/webm">
    <a href=/img/atom/pulsar-refactor.webm">Download as WebM</a>
  </video>
  <figcaption><p>Renaming a symbol in several files at once via <code>pulsar-refactor</code>.</p></figcaption>
</figure>


In Pulsar, intelligent symbol renaming can be accomplished with {pulsar-refactor} and [an IDE package that supports the `refactor` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=refactor).

## Hierarchical outline

We’ve seen how language servers often know about all the “symbols” (important things) in your project’s code. But that’s not all — many of them can represent those things in a hierarchical list. You can pair {pulsar-outline-view} (or [another `outline-view` consumer](https://web.pulsar-edit.dev/packages?serviceType=consumed&service=outline-view)) with [an IDE package that provides the `outline-view` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=outline-view) and enjoy these outlines in your left or right dock.

<figure>
  <div>
    <img src="/img/atom/pulsar-outline-view.png" alt="pulsar-outline-view screenshot">
  </div>
  <figcaption><p>Using <code>pulsar-outline-view</code>, you can visualize your source files as trees, complete with collapsing/expanding of nodes.</p></figcaption>
</figure>

Even when your language server doesn’t support hierarchical symbol lists — or when an IDE package isn’t even present! — `pulsar-outline-view` can fall back to showing a flat list of symbols. You might prefer this presentation to that of **Symbols View: Toggle File Symbols**.

## Hover information

In other editors, you might be accustomed to hovering your mouse pointer over a given function and seeing information about it — like the parameters it takes, or an explanation of what it does.

<figure>
  <div>
    <img src="/img/atom/pulsar-hover.png" alt="pulsar-hover screenshot">
  </div>
  <figcaption><p>Using <code>pulsar-hover</code>, contextual help is offered in overlay form for the symbol under the cursor.</p></figcaption>
</figure>

These kinds of contextual hints can be delivered with {pulsar-hover} and an IDE package that supports [the `hover` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=hover) or [the `datatip` service](https://web.pulsar-edit.dev/packages?serviceType=provided&service=datatip). ([Other hover-hint packages](https://web.pulsar-edit.dev/packages?serviceType=consumed&service=datatip) exist, too.)

## Progress indicators

IDE packages often perform background tasks and may want to notify the user about their progress.

The {busy-signal} package offers a way to do this. It places an icon in the status bar that will animate when such a task is in progress.

Pair it up with a package that consumes [the `atom-ide-busy-signal` service](https://web.pulsar-edit.dev/packages?serviceType=consumed&service=atom-ide-busy-signal).

::: note

A language server and its client report “capabilities” to one another when they first connect. This helps the server avoid using features that the client does not support.

One such capability is the ability for the client to report progress on background tasks. When `busy-signal` is present, any IDE package that uses the `atom-languageclient` library will automatically report this capability to the language server. The language server will then know it has a way of reporting the progress of background tasks.

When `busy-signal` is _not_ present, `atom-languageclient` reports a smaller set of client capabilities to the language server. Some language servers react to this by resorting to more invasive techniques for reporting progress — for instance, showing notifications.

:::
