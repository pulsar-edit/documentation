---
title: Interacting with other packages via services
layout: doc.ejs
---

You might want your package to interact with another package. It’s tempting to target the other package by name and call some of its internal methods, but a much safer and more powerful way for two packages to communiate is via a versioned API called a _service_.

Ultimately, packages can see and inspect one another via the {PackageManager "PackageManager instance"} defined at `atom.packages`. But services have some major upsides:

* They don’t make assumptions about package names, so a package is free to rename itself as long as its service name does not change.
* They don’t make assumptions about a package’s implementation details; a service defines a contract and is therefore safer to rely upon.
* Services define “middleware” that can be fulfilled by any number of packages. (For example: any package that wants to improve upon `autocomplete-plus` can implement the `autocomplete.provider` service and instantly talk to all the packages built to provide data to `autocomplete-plus`.)
* Services can evolve their contracts over time via versioning, and any package can fulfill any number of different versions of a given service at once.

During the package activation phase, Pulsar acts as a matchmaker to providers and consumers of services — “introducing” them to one another whenever two packages match on service name and version. This introduction doesn’t happen until _both_ packages are activated.

## Simple example

To introduce you to services, we’ll choose a simple example — one where you expect _exactly one_ provider package for a given service. Later we’ll introduce more complex use cases that better match what you might encounter in the real world.

To provide a service, specify a `providedServices` field in your `package.json`. You should include one or more version numbers, each paired with the name of a method on your package's main module:

```json
{
  "providedServices": {
    "my-service": {
      "description": "Does a useful thing",
      "versions": {
        "1.0.0": "provideMyService"
      }
    }
  }
}
```

Here we’re creating a new service from scratch, so we’ll use `1.0.0` as the version number. (The `description` field is not consumed by anything, but it’s polite to include it just so other developers understand what the service is designed to do.)

The code might look something like this:

```js
// The providing package can define an object like this that describes an API
// contract.
//
// It can be a simple object like this or something like a class instance.
// But remember that `provideMyService` will be called only once for a given
// service/version combination, no matter how many packages end up consuming
// it.
const someServiceObject = {
  async getSomeValue() {
    return Promise.resolve('something');
  },

  setSomeValue(value) {
    doSomethingWithValue(value);
  }
};


module.exports = {
  activate() {
    // ...
  },

  provideMyService() {
    return myService;
  }
};
```

Similarly, to consume a service, specify one or more [version _ranges_](https://docs.npmjs.com/cli/v6/using-npm/semver#ranges), each paired with the name of a method on the package's main module:

```json
{
  "consumedServices": {
    "my-service": {
      "versions": {
        "^1.0.0": "consumeMyService"
      }
    }
  }
}
```

Here’s how service matching will work in this example:

1. Pulsar notices that `package1` provides version `1.0.0` of `my-service`.
2. It therefore calls `provideMyService` and files its return value under `my-service@1.0.0`.
3. Later, when activating `package2`, it’ll notices that `package2` says it can consume version `1.0.0` of `my-service`.
4. It’ll look up the value it saved under `my-service@1.0.0`.
5. It’ll then call `consumeMyService` on the main export of `package2`, passing the value from step 4 as the sole argument.

That’s how our consuming package will receive the service object. How it manages that object will vary based on the service, but for now we’ll just set it as a property so we can use it later on.

You will usually need to perform some kind of cleanup in the event that the package providing the service is deactivated. To do this, return a {Disposable} from your service-consuming method:

```js
const { Disposable } = require("atom");

module.exports = {
  // The `activate` method is guaranteed to run on both the provider and the
  // consumer _before_ an introduction is made.
  activate() {
    this.service = null;
  },

  consumeMyService(service) {
    this.useService(service);
    return new Disposable(() => this.stopUsingService(service));
  },

  useService(someService) {
    // Typically, all we'd want to do at introduction time is save the service
    // so that we can use it later on.
    this.service = someService;
  },

  stopUsingService(someService) {
    // If this method is called, it means the service will no longer be
    // available, so we should null out the reference. This correctly restores
    // us to the state we would've been in if the providing package had never
    // been activated at all.
    if (this.service === someService) {
      this.service = null;
    }
  },

  async someMethodThatReliesUponTheService() {
    if (!this.service) {
      // This consumer is not guaranteed to match up with a provider; the user
      // might not have any package installed/activated that provides the
      // service. So you should anticipate this possibility and try to handle
      // it gracefully.
      //
      // Here we're just silently doing nothing when the service isn't
      // available. You may prefer something else, like showing a notification
      // to explain to the user why nothing is happening.
      return;
    }

    let value = await this.service.getSomeValue();
    doSomethingWithValue(value);
  }
};
```

If a service consumer matches up with a service provider, the two packages responsible will be introduced to each other _exactly once_ by Pulsar. No such match is guaranteed to take place. Therefore: as described in the code above, your package should be written with the understanding that the service may or may not be available.

## Service versioning

You may eventually need to make changes to your service contract. When this happens, you should increment the service’s version number according to [semver](https://semver.org/):

* If your changes merely add or fix functionality and are backward-compatible, you can increment the minor or patch versions.
* If your changes are _not_ backward-compatible, you should increment the major version number.

Suppose you change `my-service` in a backwards-incompatible way. You can still provide both versions of `my-service` to a consumer:

```json
{
  "providedServices": {
    "my-service": {
      "description": "Does a useful thing",
      "versions": {
        "1.0.0": "provideMyServiceV1",
        "2.0.0": "provideMyServiceV2"
      }
    }
  }
}
```


```js
// What if you figure out how to simplify your service object?
//
// You can keep providing the old service object…
const myServiceV1 = {
  async getSomeValue() {
    return Promise.resolve('something');
  },

  setSomeValue(value) {
    doSomethingWithValue(value);
  }
}

// …but also provide a new object that offers a different interface to the same
// underlying logic.
const myServiceV2 = {
  async doSomeWorkWithValue(value) {
    return await doSomeWork(value);
  }
};


module.exports = {
  activate() {
    // ...
  },

  provideMyServiceV1() {
    return myServiceV1;
  },

  provideMyServiceV2() {
    return myServiceV2;
  }
};
```

On the consumer side, you can choose which version of the service you want to consume:

```json
{
  "consumedServices": {
    "my-service": {
      "versions": {
        "^1.0.0": "consumeMyServiceV1",
        "^2.0.0": "consumeMyServiceV2"
      }
    }
  }
}
```

```js
const { Disposable } = require("atom");

module.exports = {
  activate() {
    this.service = null;
  },

  useService(someService) {
    this.service = someService;
  },

  stopUsingService(someService) {
    // If this method is called, it means the service will no longer be
    // available, so we should null out the reference.
    if (this.service === someService) {
      this.service = null;
    }
  },

  consumeAnotherServiceV1(service) {
    // If you're able to consume two different versions of the same service,
    // you'll probably want to wrap the legacy service so that it behaves like
    // the new service. This is left as an exercise for the reader.
    this.useService(adaptServiceFromLegacyAPI(service));
    return new Disposable(() => this.stopUsingService(service));
  },

  consumeAnotherServiceV2(service) {
    this.useService(service);
    return new Disposable(() => this.stopUsingService(service));
  },

  async someMethodThatReliesUponTheService() {
    if (!this.service) {
      // This consumer is not guaranteed to match up with a provider; the user
      // might not have any package installed/activated that provides the service.
      // So you should anticipate this possibility and try to handle it
      // gracefully.
      //
      // Here we're just silently doing nothing when the service isn't
      // available. You may prefer something else, like showing a notification
      // to explain to the user why nothing is happening.
      return;
    }

    let value = await this.service.getSomeValue();
    doSomethingWithValue(value);
  }
};
```

:::info Version strings

In the consuming package’s `package.json` we’re specifying versions using strings like `^2.0.0` — meaning “`2.0.0` or anything that starts with `2.`.” These strings can be pretty flexible; [anything understood by NPM](https://semver.npmjs.com/) will also be understood by Pulsar when matching up service providers and consumers.

So you could instead do something like `>=2.3.4 <2.5` — meaning “`2.3.4`, any `2.3` release _after_ `2.3.4`, or any `2.4` release.”

:::

:::tip Redundant introductions

You might notice that, if both provider and consumer behave as described above, the two packages will technically match _twice_: once for V1 and once for V2. Typically, you’d want to use just one of these, so you could use whatever logic you like for deciding between them.

You should not assume any particular ordering of the introductions; they’re not guaranteed to happen in the order defined in either package’s `package.json`.

In this example, you’d probably want to use V2 of the service. So you could write `consumeMyServiceV1` such that it only sets `this.service` if it’s `null`, and `consumeMyServiceV2` such that it sets `this.service` no matter what.

In more complex scenarios, you’d want to be able to consult more information to help make this decision. But there’s no accompanying metadata when a provider and consumer are introduced. So if you want to be able to consult metadata when making these decisions — version number of the service, the name of the providing package, etc. — then you should make them part of your service object.

For instance: the `symbol.provider` service requires that a service object have a `packageName` property that specifies the name of the providing package; this allows `symbols-view` to show the user where its symbol data is coming from in case the user wants to privilege one data source over another. But it could also be used in the future to guard against a package trying to provide multiple redundant versions of its service.

As you can see, this is a burden on the developer. We’d like to make service matchmaking a bit smarter in this scenario and guarantee that, in this situation, we’ll use _only_ the highest possible version number. But this is not yet implemented.

:::

## Many-to-many relationships

Services have another big advantage over hard-coded relationships between two specific packages: a provider can provide a service to any number of consumers, and a consumer can consume a service from any number of providers.

Suppose `my-service` can be provided by lots of packages, and our consuming package doesn’t want to choose between them. What might that look like?

```js
const { Disposable } = require("atom");

module.exports = {
  activate() {
    this.services = [];
  },

  useService(someService) {
    // Instead of assigning the service to a property, we add it to the
    // collection.
    if (this.services.includes(someService)) return;
    this.services.push(someService);
  },

  stopUsingService(someService) {
    let index = this.services.indexOf(someService);
    if (index === -1) return;

    // Remove this service object from the collection.
    this.services.splice(index, 1);
  },

  consumeMyService(service) {
    this.useService(service);
    return new Disposable(() => this.stopUsingService(service));
  },

  // Why would we have multiple consumers?
  //
  // We could be interested in asking _all_ of them the same question, then
  // aggregating the results…
  async someMethodThatReliesUponTheServices() {
    let promises = this.services.map((serviceObject) => {
      return serviceObject.getSomeValue();
    });

    let values = await Promise.all(promises);
    doSomethingWithValues(value);
  },

  // …or we could be interested in picking _one_ provided service among many
  // and asking it the question.
  async someMethodThatReliesUponASpecificService() {
    let winningService = this.services.find((serviceObject) => {
      // Use whatever logic you like to decide which service object is the
      // right one for this task.
      //
      // For instance: the `symbol.provider` consumer will call a method on
      // each one with some metadata and rely on the service object itself to
      // return a score that represents how fit it is for the task. The
      // consumer then selects the one with the highest score.
      return shouldPickServiceObject(serviceObject);
    });

    if (!winningService) return;
    let value = await winningService.getSomeValue();
    doSomethingWithValue(value);
  }
};
```

This gives us a lot of flexibility. It treats the providers like a room full of smart people. Whenever the consuming package want to know the answer to something, it can stick its head into the room and ask a question; whoever’s in the room _at that moment_ can try to answer it. Sometimes there’ll be a dozen people in the room, and sometimes there might be _zero_ people in the room.

::: info

This is how built-in services like `autocomplete.provider` and `symbol.provider` work. If you’re working in a TypeScript project and you start typing something, the `autocomplete-plus` package will ask its providers what could finish it, and will show the results in a menu. We’d expect a package like {pulsar-ide-typescript} to have suggestions to provide.

But if you were to do the same in a Python project, `autocomplete-plus` would ask a different group of providers. Because it doesn’t activate until you use a JavaScript or TypeScript file, {pulsar-ide-typescript} probably won’t even be active inside of a Python project — and if it is, it certainly won’t speak up if asked to complete some Python code.

:::

So it’s easy to illustrate how one consumer can pull from many providers. What about the reverse?

Suppose you didn’t like `autocomplete-plus` at all and wanted to rewrite it from scratch. Luckily, you wouldn’t have to start _entirely_ from scratch, because you have access to the same providers as `autocomplete-plus`! Simply register your package as a consumer of the `autocomplete.provider` service.

From the providing package’s perspective, this is normal. In our example, if twenty packages want to consume `my-service`, then `provideMyService` will be called twenty different times. This works just fine by design; nothing special needs to be done to enable it.
