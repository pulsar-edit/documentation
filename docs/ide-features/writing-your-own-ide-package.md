---
title: Writing your own IDE package
layout: doc.ejs
---

Pretend you’re the inventor of a new language called Zzyzx.

Because you want to get Zzyzx support into as many editors as possible with as little effort as possible, you understand that you need to write a language server for Zzyzx. Armed with your computer and [the LSP specification](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/), you lock yourself in a room and emerge with version 1.0 of `zzyzx-language-server` a week later.

Now what?

The “last mile” of integration varies with each editor, but your favorite editor is Pulsar, so obviously you’ll want to start there. Here’s how to write an IDE package for your brand new language.

## `atom-languageclient`

The `atom-languageclient` package originated on the Atom team sometime around 2017. Later, it was adopted by the `atom-community` project, and now Pulsar uses [its own fork](https://github.com/savetheclocktower/atom-languageclient).

It’s not a Pulsar package; you don’t install it from Pulsar yourself. But it’s a package meant to be used _as a dependency_ of a Pulsar package. It cuts down on almost all the boilerplate of integrating with a language server and makes it so that you can write a new integration in an hour or less.

### What do I get for free?

Let’s think about this from the perspective of the features we want, then work backwards until we reach the language server that can provide the information we need.

* We know that we have a package called {autocomplete-plus} that can offer autocompletion for anything that implements the `autocomplete.provider` service.
* We also have a language server that can offer autocompletion options for anything that can make a [`textDocument/completion` request](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_completion) — the standardized way for a lanuage server to communicate about autocompletion.
* We therefore need the IDE package to speak LSP to the language server, then translate it to `autocomplete.provider` terminology for {autocomplete-plus}.

The same need exists across other IDE features:

* Language servers have methods like [`textDocument/documentSymbol`](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_documentSymbol) and [`workspace/symbol`](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_symbol) that will provide symbol information; the IDE package just needs to translate these responses to `symbol.provider` terminology.
* Language servers can “push” diagnostic information to a language client via the [`textDocument/publishDiagnostics`](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_publishDiagnostics) as the user types in a file. The IDE package must translate these messages to the `linter-indie` service format so they can be consumed by the {linter} package.

The vast majority of this “glue” code is not specific to any one language server! If a language server abides by the spec, most of this work will already be handled by `atom-languageclient`. Indeed, most IDE packages are thin wrappers around `atom-languageclient`.

### What don’t I get for free?

Language servers are similar, but they’re not identical to one another. There will be a small amount of extra code you’ll have to write on top of what `atom-languageclient` gives you for free:

* It doesn’t know how to launch your specific language server — what it’s called, whether it runs in a Node process or not, or its communications strategy. It relies on you to tell it these things.
* It doesn’t know the name of your language or your language server.
* It doesn’t know anything about the configuration format of your language server. The LSP specification [allows the client to provide configuration data to the server](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_configuration), but the format of this data is left up to the individual server. You may want to add configuration to your IDE package that manages the configuration object that gets sent to the server.
* It doesn’t know how to identify which files should trigger it. By default, `atom-languageclient` doesn’t spawn a language server as soon as you launch Pulsar; it waits until you’ve got a relevant kind of file open for editing. (For instance, `pulsar-ide-typescript` won’t run a language server until you open a TypeScript or JavaScript file.)

    Rather than identify these languages by file extension (which can be ambiguous and doesn’t do anything for brand-new files), it identifies them by the grammar you assign — and grammars are identified by their root scopes. For `pulsar-ide-typescript`, those scopes are `source.js`, `source.ts`, and `source.ts.tsx`. Your IDE package probably works on a fixed subset of grammars, but there are ways to expand this list and make it user-configurable.

* Some IDE packages try to improve the “onboarding” experience for new installations. For instance, if the package is unable to bundle the language server, it might show a notification on first run offering a link to where the language server can be downloaded. This is outside the scope of what `atom-languageclient` does, so if you want a feature like this, you’ll need to write it yourself.

## Writing your package

::: info  

We have no clue which language you’re trying to write an IDE package for, so let’s just pretend it’s our fictional language called **Zzyzx**. Whenever you read “Zzyzx,” insert the language you’re actually working with!

Let’s further assume that a language package for Zzyzx already exists, and that it provides a Zzyzx grammar for syntax highlighting and whatnot. Much like the root “scope name” is `source.js` for JavaScript files and `source.python` for Python files, we’ll assume the root scope name for the Zzyzx grammar is `source.zzyzx`.

:::

### Bootstrap

Generate an ordinary package just like you did when you wrote [your first Pulsar package](https://docs.pulsar-edit.dev/developing-for-pulsar/package-word-count/#title). Call it `pulsar-ide-zzyzx`.

### Add `atom-languageclient`

Pulsar will open a new project window for `pulsar-ide-zzyzx`. But first let’s go into the terminal to the root of the folder where you installed it. Run:

```
npm install @savetheclocktower/atom-languageclient
```

This installs Pulsar’s fork of `atom-languageclient`.

Let’s pretend that the Zzyzx language server is written in Zzyzx and runs as a standalone executable called `zzyzx-language-server`. You must download it yourself and ensure that it is somewhere on your `PATH` so that you can just type `zzyzx-language-server` in your terminal and have it start.

::: tip

Once you get the basic stuff working, you might want to introduce a configuration option to let the user specify an absolute path to their `zzyzx-language-server` binary.

:::

### Subclass `AutoLanguageClient`

Delete the existing `.js` files in `lib`, then create a new file called `main.js`. In your `package.json`, make sure the `main` field points to `./lib/main`.

Make your `main.js` look like this:

```js
const { AutoLanguageClient } = require('@savetheclocktower/atom-languageclient');

class ZzyzxLanguageClient extends AutoLanguageClient {
  getGrammarScopes() {
    // The root language scope for Zzyzx files in Pulsar.
    return ["source.zzyzx"];
  }
  getLanguageName() {
    // What do you call your language?
    return "Zzyzx";
  }
  getServerName() {
    // What do you call this server?
    return "Zzyzx Language Server";
  }
  getPackageName() {
    // What's the name of this package?
    return "pulsar-ide-zzyzx";
  }
  startServerProcess (projectPath) {
    return super.spawn(
      // The hypothetical name of your language server's executable.
      "zzyzx-language-server",
      // Any other arguments that the server expects.
      [],
      // Options to pass to the `spawn` command (the same ones
      // `child_process.spawn` would expect in Node). Most language servers
      // expect that they can treat the working directory as the project root,
      // so that's what we'll do.
      { cwd: projectPath }
    );
  }
}

module.exports = new ZzyzxLanguageClient();
```

This is pretty easy! All you’re doing is creating a subclass of the `AutoLanguageClient` class, and that’s the class that does most of the work. It only needs you to tell it the things that it’s not able to guess on its own, like how to run your server and what the server is called.

### Expose some services

For an IDE package to be able to talk to UI packages, it has to [advertise the services](/infrastructure/interacting-with-other-packages-via-services/) it’s fluent in. Open up your `package.json` again.

Before we add the services, though, we should make this change: your `package.json` probably has an `activationCommands` field. Remove it and insert this in its place:

```json
"activationHooks": [
  "source.zzyzx:root-scope-used"
],
```

Earlier we mentioned that the language server won’t start until we have a Zzyzx file open in our editor. But we can go further than that; this metadata tells Pulsar, “you don’t actually have to _activate this package_ immediately on launch — you can wait until the user opens their first Zzyzx file!”

As for the services: [this whole block of advertised services](https://github.com/savetheclocktower/pulsar-ide-typescript/blob/321a7713b521c12a9475f7d1bacb024f536433d9/package.json#L299-L399) from `pulsar-ide-typescript` is a good one to borrow. It boasts support for pretty much everything that `atom-languageclient` can theoretically support. If your language server doesn’t actually support some of these features, that’s fine; the service provider will fail silently.

If you have a good sense of what your language server does and does not support, you can pare down this list as needed.

### Test it out

Save your source files, reload your window (make sure your window is open in [dev mode](https://docs.pulsar-edit.dev/contributing-to-pulsar/hacking-on-the-core/#running-in-development-mode)), and try writing some Zzyzx. You should see evidence of IDE features being provided! Write part of a token and see if it gets autocompleted. Open the symbols palette and see if you can spot any new entries.

You can also invoke the **Symbols View: Show Active Providers** command from your command palette to see a list of symbol providers. One of them should be called _Zzyzx Language Server_. If it isn’t there, chances are good that there’s an error somewhere preventing the package from activating properly; [open your developer tools and look for errors](/troubleshooting-pulsar/checking-for-errors-in-developer-tools/).

If this doesn’t work, turn on logging [as described on the troubleshooting page](/ide-features/troubleshooting/#what-if-i-just-want-to-look-at-logs%253F) and see if the logs shed any light.

## Customization via overrides

The fact that `AutoLanguageClient` does so much of the work may make it seem like you don’t have much of a say in how your package behaves. But there are many ways to customize language server responses!

Above we saw the methods that you are _required_ to implement in your subclass order for `AutoLanguageClient` to do its work. But there are many other methods that have default implementations, but are meant to be overridden if you want your package to behave differently.

Here’s a non-exhaustive list of things you can customize. For the full list, [read the `AutoLanguageClient` source code](https://github.com/savetheclocktower/atom-languageclient/blob/master/lib/auto-languageclient.ts).

```js
class ZzyzxLanguageClient extends AutoLanguageClient {
  // (all the methods from before, plus…)

  // CORE OVERRIDES
  // ==============

  // You can customize the logic that decides when to spawn a language server
  // if one isn't already running.
  shouldStartForEditor(textEditor) {
    let shouldStart = super.shouldStartForEditor(textEditor);
    // By default it compares the editor's grammar to the list of scope names
    // from before. Here, though, you could impose additional requirements,
    // like the presence of a configuration file.
    return atom.project.getDirectories().some((directory: Directory) => {
      // We'll check for a file called `.zzyzx-config` in each of the project
      // roots; if one doesn't exist, we won't start the server.
      let configFile = directory.getFile('.zzyzx-config');
      return configFile.existsSync();
    });
  }

  // You can customize the data that is sent to the language server during
  // initialization.
  getInitializeParams(projectPath, languageServerProcess) {
    let result = super.getInitializeParams(projectPath, languageServerProcess);
    // Language servers wait for the client to report its own capabilities,
    // then behave accordingly. They won't try to do things for which the
    // client doesn't advertise support. In some cases you can use this to "opt
    // out" of features that you might not want from the server for one reason
    // or another (like configurability).
    //
    // Here's an example from real life: a language server wants some way of
    // reporting the progress of a long-running task. That's why we use
    // `busy-signal`, but if that package isn't installed, we don't advertise
    // support for this capability, so a server might fall back to a more
    // invasive method of reporting progress — like showing notifications.
    //
    // One way around this is to opt into the `window.workDoneProgress`
    // capability whether or not we know how to handle it.
    result.window.workDoneProgress = true;
    return result;
  }

  getConnectionType() {
    // `atom-languageclient` supports three methods of communicating with the
    // language server process: `socket`, `stdio`, and `ipc`. You may force
    // a specific type here.
    return 'stdio';
  }

  // CORE CONFIGURATION
  // ==================

  // If you like, you can formally link your IDE package's configuration schema
  // to that of your language server. One approach would be to define a special
  // section in your schema so that only a subset of your settings are used.
  //
  // If this system is used, `AutoLanguageClient` will observe this key path
  // and send a new configuration immediately if the user changes any settings
  // while the language server is running.
  getRootConfigurationKey(): string {
    return `${this.getPackageName()}.serverSettings`
  }

  // By default, whatever gets returned above would be sent to the server as
  // configuration. In this case, it would be the return value of:
  //
  //   atom.config.get('pulsar-ide-zzyzx.serverSettings');
  //   
  // But you can, if necessary, transform the configuration object before
  // sending it to the server.
  //
  mapConfigurationObject(configuration) {
    return configuration
  }

  // CORE HOOKS
  // ==========

  preInitialization(languageClientConnection) {
    // Act after a language server is spawned but before the client reports its
    // capabilities.
  }

  postInitialization(server) {
    // Act after the language server reports its capabilities to the server.
    // This hook is sometimes used to send configuration or call custom methods
    // that aren't in the LSP spec.
  }

  // FILTERING
  // =========

  // Sometimes a language server considers _practically anything_ to be a
  // symbol. One way to filter that list is to implement this method and have
  // it ignore symbols that aren't important.
  shouldIgnoreSymbol(symbol) {
    return symbol.tag === 'variable'
  }


  // Similarly, you have an opportunity to ignore certain diagnostic messages
  // before they are handled by the `linter` package.
  shouldIgnoreMessage(diagnostic, textEditor, range) {
    // Diagnostic messages often have an associated severity: error, warning,
    // info, or hint. Let's ignore hints.
    return diagnostic.severity === 4;
  }

  // And you can also filter code actions before they're shown in an
  // `intentions` menu.
  filterCodeActions(commandsOrCodeActions) {
    // Not the most elegant example, but this would be one way of disabling
    // code actions altogether.
    if (!atom.config.get(`${this.getPackageName()}.codeActions.enable`)) {
      return null
    }
  }

  // PRIORITY
  // ========

  // When more than one provider is available for a certain feature, UI
  // packages often resolve this with a "priority" system: each provider
  // reports its own priority score, and the highest number wins.
  //
  // This allows for some amount of customization of which provider gets picked
  // in certain scenarios. The default return value of this method is `1`, but
  // you can instead expose it to the user to customize.
  getPriorityForHover() {
    let setting = atom.config.get(`${this.getPackageName()}.hover.priority`)
    return setting
  }

  getPriorityForSignatureHelp() {
    // (et cetera)
  }

  getPriorityForCodeFormat() {
    // (et cetera)
  }

  // HOOKS
  // =====

  // This function is called _before_ a given code action is executed. This
  // gives you a chance to prevent the code action or allow it to proceed. You
  // can even go async if you need to, though it's best for the user if you
  // don't go _too_ async.
  async onApplyCodeActions(commandOrCodeAction) {
    if (await someDisruptiveTaskIsOngoing()) {
      return false
    }
    return true
  }

  // This function is called immediately after an autocompletion suggestion is
  // inserted. It gives you a chance to act before the UI updates.
  //
  // One contrived example: suppose your language server inserts text
  // incorrectly in certain scenarios and you'd like to work around it until
  // the bug is fixed upstream.
  onDidInsertSuggestion(suggestionInsertedEvent) {
    let { editor, triggerPosition, suggestion } = suggestionInsertedEvent;

    if (suggestion.text) {
      let range = new Range(
        triggerPosition,
        triggerPosition.traverse([0, suggestion.length])
      );
      let originalText = editor.getTextInRange(range);
      let fixedText = fixBugInLanguageServerAutocompletion(originalText);
      editor.setTextInRange(range, fixedText);
    }
  }  
}
```

## I’m stuck!

We love IDE packages and want to make their authorship as headache-free as possible. If you get stuck, [reach out via a community channel](https://pulsar-edit.dev/community/) and we’ll help you figure it out.
