---
title: Maintaining your package
layout: doc.ejs
---

While publishing is, by far, the most common action you will perform when
working with the packages you provide, there are other things you may need to do.

## Publishing a package manually

::: danger Stop

Publishing a package manually is not a recommended practice and is only for the advanced user who has published packages before. If you perform the steps wrong, you may be unable to publish the new version of your package and may have to completely unpublish your package in order to correct the faulty state. You have been warned.

:::

Some people prefer to control every aspect of the package publishing process. Normally, the ppm tool manages certain details during publishing to keep things consistent and make everything work smoothly. If you’re one of those people that prefers to do things manually, there are certain steps you’ll have to take in order to make things work just as smoothly as if ppm has taken care of things for you.

::: note Note

The `ppm` tool will only publish and [Pulsar Package Registry](https://web.pulsar-edit.dev) will only list packages that are hosted on [GitHub](https://github.com), regardless of what process is used to publish them.

:::

When you have completed the changes that you want to publish and are ready to start the publishing process, you must perform the following steps on the `master` branch:

1. Update the version number in your package’s `package.json`. The version number **must** match the regular expression: `^\d+\.\d+\.\d+`
2. Commit the version number change
3. Create a Git tag referencing the above commit. The tag **must** match the regular expression `^v\d+\.\d+\.\d+` and the part after the `v` **must** match the full text of the version number in the `package.json`
4. Execute `git push --follow-tags`
5. Execute `pulsar -p publish --tag tagname` where `tagname` **must** match the name of the tag created in the above step

## Adding a collaborator

Some packages get too big for one person. Sometimes priorities change and someone else wants to help out. You can let others help or create co-owners by [adding them as a collaborator](https://help.github.com/articles/adding-collaborators-to-a-personal-repository/) on the GitHub repository for your package. _Note:_ Anyone that has push access to your repository will have the ability to publish new versions of the package that belongs to that repository.

You can also have packages that are owned by a [GitHub organization](https://help.github.com/articles/creating-a-new-organization-account/). Anyone who is a member of an organization’s [team](https://help.github.com/articles/permission-levels-for-an-organization/) which has push access to the package’s repository will be able to publish new versions of the package.

## Transferring ownership

::: danger STOP

🚨 This is a permanent change. There is no going back! 🚨

:::

If you want to hand off support of your package to someone else, you can do that by [transferring the package’s repository](https://help.github.com/articles/transferring-a-repository/) to the new owner. Once you do that, they can publish a new version with the updated repository information in the `package.json`.

## Unpublish your package

::: danger Stop

🚨 This is a permanent change. There is no going back! 🚨

The name of your package will be reserved even after being unpublished!

:::

If you no longer want to support your package and cannot find anyone to take it over, you can unpublish your package from [Pulsar Package Registry](https://web.pulsar-edit.dev). For example, if your package is named `package-name`, you’d run:

```sh
$ pulsar -p unpublish package-name
```

This will remove your package from the package registry. Anyone who has already downloaded a copy of your package will still have it and be able to use it, but it will no longer be available for installation by others. Additionally, to prevent a possible [supply chain attack](https://en.wikipedia.org/wiki/Supply_chain_attack), the name your package used will **forever** be unusable by yourself or any other community package.

### Unpublish a specific version

If you mistakenly published a version of your package or perhaps you find a glaring bug or security hole, you may want to unpublish just that version of your package. For example, if your package is named `package-name` and the bad version of your package is v1.2.3 then the command you would execute is:

```sh
$ pulsar -p unpublish package-name@1.2.3
```

This will remove just this particular version from the package registry.

## Rename your package

If you need to rename your package for any reason, you can do so with one simple command – `pulsar -p publish --rename` changes the `name` field in your package’s `package.json`, pushes a new commit and tag, and publishes your renamed package. Requests made to the previous name will be forwarded to the new name.

```sh
$ pulsar -p publish --rename <new-package-name>
```

::: warning Warning

For the reasons stated above, once a package name has been used, it cannot be reused by another package even if the original package is unpublished. This also applies to any name your package previously had before a renaming.

:::
