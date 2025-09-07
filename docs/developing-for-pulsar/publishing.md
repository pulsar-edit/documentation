---
title: Publishing
layout: doc.ejs
---

Pulsar bundles a command line utility called `ppm` into every installation of Pulsar, to search for and install packages via the command line. This is invoked by using the `pulsar` command with the `-p` or `--package` option. Optionally, you are still able to call PPM directly via `ppm` in the command line. The `pulsar -p` command can also be used to publish Pulsar packages to the public registry and update them.

See more in [Using PPM](/contributing-to-pulsar/using-ppm/).

## Prepare your package

There are a few things you should double check before publishing:

- Your `package.json` file has `name`, `description`, and `repository` fields.
- Your `package.json` `name` is URL-safe — meaning it contains no emoji or other special characters that are invalid in a URL.
- Your `package.json` file has a `version` field with a value of `"0.0.0"`.
- Your `package.json` `version` field is [SemVer v2](https://semver.org/spec/v2.0.0.html) compliant.
- Your `package.json` file has an `engines` field that contains an entry for
  `atom` such as: `"engines": {"atom": ">=1.0.0 <2.0.0"}`.
- Your package has a `README.md` file at the root.
- Your `repository` URL in the `package.json` file is the same as the URL of
  your repository.
- Your package is in a Git repository that has been pushed to
  [GitHub](https://github.com). Follow [this guide](https://help.github.com/articles/importing-a-git-repository-using-the-command-line/) if your package isn’t already on GitHub.

## Publish your package

Before you publish a package, it’s a good idea to check ahead of time if a package with the same name has already been published to [the Pulsar Package Registry](https://packages.pulsar-edit.dev/packages). You can do that by visiting `https://packages.pulsar-edit.dev/packages/your-package-name` to see if the package already exists. If it does, update your package’s name to something that is available before proceeding.

Now let’s review what the `pulsar -p publish` command does:

1. Registers the package name on Pulsar Package Registry if it is being published for the first time.
2. Updates the `version` field in the `package.json` file and commits it.
3. Creates a new [Git tag](https://git-scm.com/book/en/Git-Basics-Tagging) for the version being published.
4. Pushes the tag and current branch up to GitHub.
5. Updates Pulsar Package Registry with the new version being published.

Now run the following commands to publish your package:

```sh
$ cd path-to-your-package
$ pulsar -p publish minor
```

<!-- TODO: Rewrite this Section once Authentication Information is Public -->

If this is the first package you are publishing, the `pulsar -p publish` command may prompt you for your GitHub username and password. If you have two-factor authentication enabled, use a [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) in lieu of a password. This is required to publish and you only need to enter this information the first time you publish. The credentials are stored securely in your [keychain](<https://en.wikipedia.org/wiki/Keychain_(software)>) once you login.

Your package is now published and available on Pulsar Package Registry. Head on over to `https://packages.pulsar-edit.dev/packages/your-package-name` to see your package’s page.

With `pulsar -p publish`, you can bump the version and publish by using

```sh
$ pulsar -p publish <version-type>
```

where `version-type` can be `major`, `minor`, or `patch`:

- `major` when you make backwards-incompatible API changes,
- `minor` when you add functionality in a backwards-compatible manner, or
- `patch` when you make backwards-compatible bug fixes.

For instance, to bump a package from v1.**0**.0 to v1.**1**.0:

```sh
$ pulsar -p publish minor
```

Check out [semantic versioning](https://semver.org/) to learn more about best practices for versioning your package releases.

You can also run `pulsar -p help publish` to see all the available options and `pulsar -p help` to see all the other available commands.
