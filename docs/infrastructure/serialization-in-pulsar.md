---
title: Serialization in Pulsar
layout: doc.ejs
---

If you ever need to quit Pulsar and relaunch, or to reload the current window, Pulsar will try to restore your workspace as you left it. To do so, it might need cooperation from the various packages that can place content into your workspace.

When Pulsar needs to preserve state for later restoration, it will ask each package to _serialize_ its state. It will then store that aggregate state in JSON. When a window is restored, that state is divvied up among the packages that contributed to it, and each package will then _deserialize_ its slice of state so that it can recreate whatever content it had in the workspace.

For your own package to be able to persist content across window sessions, you’ll need to come up with a simple scheme for serializing and deserializing.

## Package serialization hook

Your package’s main module can optionally include a `serialize` method. When a window unloads, each of its packages will be deactivated, but if `serialize` exists, it will be called before deactivation.

Your `serialize` method should return a JSON-serializable object — _not_ a string. This object is of the same format that will later be given back to you.

In the following example, the package keeps an instance of `MyObject` in the same state across refreshes.

```js
module.exports = {
	activate(state) {
		this.myObject = state
			? atom.deserializers.deserialize(state)
			: new MyObject("Hello");
	},

	serialize() {
		return this.myObject.serialize();
	},
};
```

## Serialization methods

```js
class MyObject {
	constructor(data) {
		this.data = data;
	}

	serialize() {
		return {
			deserializer: "MyObject",
			data: this.data,
		};
	}
}
```

### `serialize()`

Objects that you want to serialize should implement `.serialize()`. This method should return a serializable object, and it must contain a key named `deserializer` whose value is the name of a registered deserializer that can convert the rest of the data to an object. It’s usually just the name of the class itself.

### Registering deserializers

The other side of the coin is _deserializers_, whose job is to convert a state object returned from a previous call to `serialize` back into a genuine object.

#### `deserializers` in `package.json`

The preferred way to register deserializers is via your package’s `package.json` file:

```json
{
  "name": "wordcount",
  ...
  "deserializers": {
    "MyObject": "deserializeMyObject"
  }
}
```

Here, the key (`"MyObject"`) is the name of the deserializer—the same string used by the `deserializer` field in the object returned by your `serialize()` method. The value (`"deserializeMyObject"`) is the name of a function in your main module that’ll be passed the serialized data and will return a genuine object. For example, your main module might look like this:

```js
module.exports = {
	deserializeMyObject({ data }) {
		return new MyObject(data);
	},
};
```

Now you can call the global `deserialize` method with state returned from `serialize`, and your class’s `deserialize` method will be selected automatically.

#### `atom.deserializers.add(klass)`

An alternative is to use the `atom.deserializers.add` method with your class in order to make it available to the deserialization system. Usually this is used in conjunction with a class-level `deserialize` method:

```js
class MyObject {
	static initClass() {
		atom.deserializers.add(this);
	}

	static deserialize({ data }) {
		return new MyObject(data);
	}

	constructor(data) {
		this.data = data;
	}

	serialize() {
		return {
			deserializer: "MyObject",
			data: this.data,
		};
	}
}

MyObject.initClass();
```

While this used to be the standard method of registering a deserializer, the `package.json` method is now preferred since it allows Pulsar to defer loading and executing your code until it’s actually needed.

## Versioning

```js
class MyObject {
	static initClass() {
		atom.deserializers.add(this);

		this.version = 2;
	}

	static deserialize(state) {
		// ...
	}

	serialize() {
		return {
			version: this.constructor.version,
			// ...
		};
	}
}

MyObject.initClass();
```

Your serializable class can optionally have a class-level `version` property and include a `version` key in its serialized state. When deserializing, Pulsar will only attempt to call `deserialize` if the two versions match — otherwise it will discard the state and pass `undefined`.

<!--TODO: Evaluate if the following is still true for us: We plan on implementing a migration system in the future, but this at least protects you from improperly deserializing old state. -->
