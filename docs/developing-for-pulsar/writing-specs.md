---
title: Writing specs
layout: doc.ejs
---

Pulsar uses [Jasmine](https://jasmine.github.io/archives/1.3/introduction) as its spec framework. Pulsar’s core and builtin packages have specs to guard against regressions.

Likewise, your own package can (and should!) have specs to prove that it does what you claim, and to make sure that it keeps doing those things as you add features and fix bugs.

## Create a new spec file

[Pulsar specs](https://github.com/pulsar-edit/pulsar/tree/HEAD/spec) and [package specs](https://github.com/pulsar-edit/markdown-preview/tree/HEAD/spec) are added to their respective `spec` directories. The example below creates a spec for Pulsar core.

### Create a spec file

Specs go into the `spec` directory at the root of a package. Files in the `spec` directory **must** end with `-spec`, so let’s add a file called `sample-spec.js` to your package’s `spec` directory.

### Add one or more `describe` methods

The `describe` method takes two arguments: a description and a function. If the description explains a behavior it typically begins with `when`; if it’s more like a unit test, it begins with the method name.

```js
describe("when a test is written", function () {
	// contents
});
```

or

```js
describe("TextEditor::moveUp", function () {
	// contents
});
```

### Add one or more `it` methods

The `it` method also takes two arguments: a description and a function. Try and make the description continue the sentence that an enclosing `describe` method started. For example, a description of "this should work" doesn’t read well as "it this should work". But a description of "should work" sounds great as "it should work".

```js
describe("when a test is written", function () {
	it("has some expectations that should pass", function () {
		// Expectations
	});
});
```

### Add one or more expectations

The best way to learn about expectations is to read the [Jasmine documentation](https://jasmine.github.io/archives/1.3/introduction#section-Expectations) about them. Below is a simple example.

```js
describe("when a test is written", function () {
	it("has some expectations that should pass", function () {
		expect("apples").toEqual("apples");
		expect("oranges").not.toEqual("apples");
	});
});
```

#### Custom matchers

In addition to Jasmine’s built-in matchers, Pulsar includes the following:

- [jasmine-jquery](https://github.com/velesin/jasmine-jquery)
- The `toBeInstanceOf` matcher is for the `instanceof` operator
- The `toHaveLength` matcher compares against the `.length` property
- The `toExistOnDisk` matcher checks if the file exists in the filesystem
- The `toHaveFocus` matcher checks if the element currently has focus
- The `toShow` matcher tests if the element is visible in the dom

These are defined in [spec/spec-helper.js](https://github.com/pulsar-edit/pulsar/blob/HEAD/spec/spec-helper.js).

## Asynchronous specs

Managing asynchronicity used to be much harder in specs, but better async support in JavaScript has made life easier. In  Jasmine, both `describe` and `it` can accept `async` functions, as can the `beforeEach` and `afterEach` lifecycle methods.

### Preferred: `async`/`await`

Specs can be written linearly by `await`ing wherever a method returns a promise:

```js
describe(`when we open a file`, () => {
  it(`should be opened in an editor`, async () => {
    await atom.workspace.open("c.coffee");
		expect(editor.getPath()).toContain("c.coffee");
  })
})
```

You might encounter older specs written in a more awkward style, as was needed before `async`/`await`; this method is documented below.

### Legacy: `waitsForPromise`

```js
describe("when we open a file", function () {
	it("should be opened in an editor", function () {
		waitsForPromise(function () {
			atom.workspace
				.open("c.coffee")
				.then((editor) => expect(editor.getPath()).toContain("c.coffee"));
		});
	});
});
```

This method can be used in the `describe`, `it`, `beforeEach` and `afterEach` functions.

```js
describe("when we open a file", function () {
	beforeEach(function () {
		waitsForPromise(() => atom.workspace.open("c.coffee"));
	});

	it("should be opened in an editor", function () {
		expect(atom.workspace.getActiveTextEditor().getPath()).toContain(
			"c.coffee"
		);
	});
});
```

If you need to wait for multiple promises use a new `waitsForPromise` function for each promise. (Caution: Without `beforeEach` this example will fail!)

```js
describe("waiting for the packages to load", function () {
	beforeEach(function () {
		waitsForPromise(() => atom.workspace.open("sample.js"));

		waitsForPromise(() => atom.packages.activatePackage("tabs"));

		waitsForPromise(() => atom.packages.activatePackage("tree-view"));
	});

	it("should have waited long enough", function () {
		expect(atom.packages.isPackageActive("tabs")).toBe(true);
		expect(atom.packages.isPackageActive("tree-view")).toBe(true);
	});
});
```

`waitsForPromise` can take an additional object argument before the function. The object can have the following properties:

- `shouldReject` Whether the promise should reject or resolve (default: `false`)
- `timeout` The amount of time (in ms) to wait for the promise to be resolved or
  rejected (default: `process.env.CI ? 60000 : 5000`)
- `label` The label to display if promise times out (default: `'promise to be resolved or rejected'`)

```js
describe("when we open a file", function () {
	it("should be opened in an editor", function () {
		waitsForPromise(
			{
				shouldReject: false,
				timeout: 5000,
				label: "promise to be resolved or rejected",
			},
			() =>
				atom.workspace
					.open("c.coffee")
					.then((editor) => expect(editor.getPath()).toContain("c.coffee"))
		);
	});
});
```

#### Asynchronous functions with callbacks

Specs for asynchronous functions can be done using the `waitsFor` and `runs` functions. A simple example:

```js
describe("fs.readdir(path, cb)", function () {
	it("is async", function () {
		const spy = jasmine.createSpy("fs.readdirSpy");
		fs.readdir("/tmp/example", spy);

		waitsFor(() => spy.callCount > 0);

		runs(function () {
			const exp = [null, ["example.coffee"]];

			expect(spy.mostRecentCall.args).toEqual(exp);
			expect(spy).toHaveBeenCalledWith(null, ["example.coffee"]);
		});
	});
});
```

For a more detailed documentation on asynchronous tests, please visit the [Jasmine documentation](https://jasmine.github.io/archives/1.3/introduction#section-Asynchronous_Support).

## Running specs

Most of the time you’ll want to run specs by triggering the `window:run-package-specs` command. This command is not only to run package specs, it can also be used to run Pulsar core specs when working on Pulsar itself. This will run all the specs in the current project’s `spec` directory.

To run a limited subset of specs, use the `fdescribe` or `fit` methods. You can use those to “focus” a single spec or several specs. Modified from the example above, focusing an individual spec looks like this:

```js
describe("when a test is written", function () {
	fit("has some expectations that should pass", function () {
		expect("apples").toEqual("apples");
		expect("oranges").not.toEqual("apples");
	});
});
```

### Running on CI

It is possible to run the specs in a CI environment like GitHub Actions. The [action-pulsar-dependency page](https://github.com/marketplace/actions/action-pulsar-dependency-tester) has details.


### Running via the command line

To run tests on the command line, run Pulsar with the `--test` flag followed by one or more paths to test files or directories. You can also specify a `--timeout` option, which will force-terminate your tests after a certain number of seconds have passed.

```sh
pulsar --test --timeout 60 ./test/test-1.js ./test/test-2.js
```

## Customizing your test runner

By default, package tests are run with Jasmine 1.3, which is outdated but can’t be changed for compatibility reasons. You can specify your own custom test runner by including an `atomTestRunner` field in your `package.json`. Pulsar will require whatever module you specify in this field, so you can use a relative path or the name of a module in your package’s dependencies.

Your test runner module must export a single function, which Pulsar will call within a new window to run your package’s tests. Your function will be called with the following parameters:

- `testPaths` An array of paths to tests to run. Could be paths to files or
  directories.
- `buildAtomEnvironment` A function that can be called to construct an instance
  of the `atom` global. No `atom` global will be explicitly assigned, but you
  can assign one in your runner if desired. This function should be called with
  the following parameters:
  - `applicationDelegate` An object responsible for Pulsar’s interaction with
    the browser process and host OS. Use `buildDefaultApplicationDelegate` for a
    default instance. You can override specific methods on this object to prevent
    or test these interactions.
  - `window` A window global.
  - `document` A document global.
  - `configDirPath` A path to the configuration directory (usually `~/.pulsar`).
  - `enablePersistence` A boolean indicating whether the Pulsar environment
    should save or load state from the file system. You probably want this to be
    `false`.
- `buildDefaultApplicationDelegate` A function that builds a default instance
  of the application delegate, suitable to be passed as the `applicationDelegate`
  parameter to `buildAtomEnvironment`.
- `logFile` An optional path to a log file to which test output should be logged.
- `headless` A boolean indicating whether or not the tests are being run from
  the command line via `pulsar --test`.
- `legacyTestRunner` This function can be invoked to run the legacy Jasmine
  runner, giving your package a chance to transition to a new test runner while
  maintaining a subset of its tests in the old environment.

Your function should return a promise that resolves to an exit code when your tests are finished running. This exit code will be returned when running your tests via the command line.
