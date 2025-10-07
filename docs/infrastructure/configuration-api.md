---
title: Configuration API
layout: doc.ejs
---

## Reading config settings

If you are writing a package that you want to make configurable, you’ll need to read config settings via the `atom.config` global. You can read the current value of a namespaced config key with {Config::get "atom.config.get"}:

```js
// read a value with `config.get`
if (atom.config.get("editor.showInvisibles")) {
	this.showInvisibles();
}
```

Or you can subscribe via {Config::observe "atom.config.observe"} to track changes from any view object.

```js
const { View } = require('space-pen')

class MyView extends View {
  function attached() {
    this.fontSizeObserveSubscription =
      atom.config.observe('editor.fontSize', (newValue) => {
        this.adjustFontSize(newValue)
      })
  }

  function detached() {
    this.fontSizeObserveSubscription.dispose()
  }
}
```

The {Config::observe "atom.config.observe"} method will call the given callback immediately with the current value for the specified key path, and it will also call it in the future whenever the value of that key path changes. If you only want to invoke the callback the next time the value changes, use {Config::onDidChange "atom.config.onDidChange"} instead.

Subscription methods return {Disposable} objects that can be used to unsubscribe. Note in the example above how we save the subscription to the `fontSizeObserveSubscription` property and dispose of it when the view is detached. To group multiple subscriptions together, you can add them all to a {CompositeDisposable} that you dispose when the view is detached.

## Writing config settings

The `atom.config` database is populated on startup from <span class="platform-linux platform-mac">`~/.pulsar/config.cson`</span> <span class="platform-win">`%USERPROFILE%\.pulsar\config.cson`</span> but you can programmatically write to it with {Config::set "atom.config.set"}:

```js
// basic key update
atom.config.set("core.showInvisibles", true);
```

If you’re exposing package configuration via specific key paths, you’ll want to associate them with a schema in your package’s main module. Read more about schemas in the [Config API documentation](/api/pulsar/latest/Config/).
