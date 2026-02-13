---
title: Publishing
layout: doc.ejs
---

Pulsar bundles a command line utility called `ppm` into every installation; it lets you search for and install packages via the command line. It’s invoked by using the `pulsar` command with the `-p` or `--package` option. (Usually, though, you are still able to call PPM directly via `ppm` on the command line.) The `pulsar -p` command can also be used to publish Pulsar packages to the public registry and update them.

See more in [Using PPM](/contributing-to-pulsar/using-ppm/).

## Prepare your package

There are a few things you should double check before publishing:

- Your package is in a Git repository that has been pushed to [GitHub](https://github.com). Follow [this guide](https://help.github.com/articles/importing-a-git-repository-using-the-command-line/) if your package isn't already on GitHub.
- Your `package.json` file…
  - …has a “URL-safe” `name` field — without emoji or special characters.
  - …has a `description` field.
  - …has a `repository` field containing the URL of your repository.
  - …has a `version` field that is [Semver V2](https://semver.org/spec/v2.0.0.html) compliant and has a value of `"0.0.0"` before the first release.
  - …has an `engine` field that contains an entry for `atom` such as: `"engines": { "atom": ">=1.0.0 <2.0.0" }`.

## Publish your package

Before you publish a package, it’s a good idea to check ahead of time if a package with the same name has already been published to [the Pulsar Package Registry](https://packages.pulsar-edit.dev/). You can do that by visiting `https://packages.pulsar-edit.dev/packages/your-package-name` to see if the package already exists. If it does, update your package’s name to something that is available before proceeding.

If this is your first time publishing, run:

```sh
$ pulsar -p login
```

This will let you create and set an API token in your [keychain](https://en.wikipedia.org/wiki/Keychain_(software)) to permit interacting with the GitHub API.

Now run the following command to publish your package:

```sh
$ pulsar -p publish minor
```

Here’s what that command does:

1. Registers the package name on Pulsar Package Registry if it is being published for the first time.
2. Updates the `version` field in the `package.json` file — incrementing the minor version, in this example — and commits it.
3. Creates a new [Git tag](https://git-scm.com/book/en/Git-Basics-Tagging) for the version being published.
4. Pushes the tag and current branch up to GitHub.
5. Updates Pulsar Package Registry with the new version being published.

Your package is now published and available on Pulsar Package Registry. Head on over to `https://packages.pulsar-edit.dev/packages/your-package-name` to see your package’s page.

## Advanced usage of `publish`

How else can we use the `publish` command? Let’s ask for its usage information via `pulsar -p help publish`:

```
Usage: ppm publish [<newversion> | major | minor | patch]
       ppm publish --tag <tagname>
       ppm publish --rename <new-name>
```

This tells us some useful things.

First: we can specify an exact version number we want to use for the new release… or we can specify `major`, `minor`, or `patch`:

* `major` when you make backwards-incompatible API changes (`1.0.0` becomes `2.0.0`),
* `minor` when you add functionality in a backwards-compatible manner (`1.0.0` becomes `1.1.0`), or
* `patch` when you make backwards-compatible bug fixes (`1.0.0` becomes `1.0.1`).

For instance, if all you’ve done since the last release is fix small bugs, you’ll probably want to run this command to publish:

```sh
$ pulsar -p publish patch
```

Check out [semantic versioning](https://semver.org/) to learn more about best practices for versioning your package releases.

Second: If we have an existing tag that we want to publish — instead of asking `ppm` to create a new tag for us — we can specify that instead! Keep in mind that it must be of the form `vx.y.z` — for example, `ppm publish --tag v1.12.0` — and the tag must not have been published previously.

Finally: we can also rename our package at publish time! `ppm` handles the chore of changing the name in `package.json` and tells the Pulsar Package Registry about the new name. The registry takes care of updating the record and ensuring that the old name is never used again (to prevent supply chain attacks). All users that are subscribed to our package under the old name will still be notified about the new version and will have their local copy renamed once they download the update.
