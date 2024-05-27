---
title: Interacting with other packages via services
layout: doc.ejs
---

You might want your package to interact with another package. It’s tempting to target the other package by name and call some of its internal methods, but a much safer and more powerful way for two packages to communiate is via a versioned API called a _service_.

Ultimately, packages can see and inspect one another via the {PackageManager} defined at `atom.packages`. But services have some major upsides:

* They don’t make assumptions about package names, so a package is free to rename itself as long as its service name does not change.
* They don’t make assumptions about a package’s implementation details; a service defines a contract and is therefore safer to rely upon.
* Services define “middleware” that can be fulfilled by any number of packages. (For example: any package that wants to improve upon `autocomplete-plus` can implement the `autocomplete.provider` service and instantly talk to all the packages built to provide data to `autocomplete-plus`.)
* Services can evolve their contracts over time via versioning, and any package can fulfill any number of different versions of a given service at once.

During the package activation phase, Pulsar acts as a matchmaker to providers and consumers of services — “introducing” them to one another whenever two packages match on service name and version.

To provide a service, specify a `providedServices` field in your `package.json`. You should include one or more version numbers, each paired with the name of a method on your package's main module:

```json
{
	"providedServices": {
		"my-service": {
			"description": "Does a useful thing",
			"versions": {
				"1.2.3": "provideMyServiceV1",
				"2.3.4": "provideMyServiceV2"
			}
		}
	}
}
```

In your package's main module, implement the methods named above. These methods will be called any time a package is activated that consumes their corresponding service. They should return a value that implements the service's API.

```js
module.exports = {
	activate() {
		// ...
	},

	provideMyServiceV1() {
		return adaptToLegacyAPI(myService);
	},

	provideMyServiceV2() {
		return myService;
	},
};
```

Similarly, to consume a service, specify one or more [version _ranges_](https://docs.npmjs.com/cli/v6/using-npm/semver#ranges), each paired with the name of a method on the package's main module:

```json
{
	"consumedServices": {
		"another-service": {
			"versions": {
				"^1.2.3": "consumeAnotherServiceV1",
				">=2.3.4 <2.5": "consumeAnotherServiceV2"
			}
		}
	}
}
```

These methods will be called any time a package is activated that _provides_ their corresponding service. They will receive the service object as an argument.

You will usually need to perform some kind of cleanup in the event that the package providing the service is deactivated. To do this, return a {Disposable} from your service-consuming method:

```js
const { Disposable } = require("atom");

module.exports = {
	activate() {
		// ...
	},

	consumeAnotherServiceV1(service) {
		useService(adaptServiceFromLegacyAPI(service));
		return new Disposable(() => stopUsingService(service));
	},

	consumeAnotherServiceV2(service) {
		useService(service);
		return new Disposable(() => stopUsingService(service));
	},
};
```
