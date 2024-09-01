---
title: Atom-LanguageClient Package Wiki
layout: doc.ejs
---

The following wiki article is a small piece of Pulsar/Atom's history.
It may also prove to be useful when dealing with this particular package.
This wiki entry was taken directly from the [`atom/atom-languagelcient` package wiki](https://github.com/atom/atom-languageclient/wiki) and is mirrored here in case that ever becomes inaccessible.

::: warning Warning

The contents of this article do not in any way represent actions, thoughts, or ideas expressed by the Pulsar team.
Full credit for the content of the below page belongs to [@Damien Guard](https://github.com/damieng) and [@David Wilson](https://github.com/daviwil).

:::

## List of Atom packages using `atom-languageclient`

Here are the known Atom packages that are using atom-languageclient today;

### Official Packages

- [C#](https://github.com/pulsar-edit/ide-csharp) based on Omnisharp.
- [Flow](https://github.com/flowtype/ide-flowtype) from Facebook.
- [Java](https://github.com/pulsar-edit/ide-java) based on Eclipse JDT.
- [JSON](https://github.com/pulsar-edit/ide-json) based on VSCode JSON language server.
- [TypeScript](https://github.com/pulsar-edit/ide-typescript) based on TypeScript server.

### Community Packages

- [Bash](https://github.com/mads-hartmann/ide-bash) provides Bash language support using [Bash Language Server](https://github.com/mads-hartmann/bash-language-server).
- [Docker](https://web.pulsar-edit.dev/packages/ide-docker) provides Dockerfile language support using the [Dockerfile Language Server](https://github.com/rcjsuen/dockerfile-language-server-nodejs).
- [Fortran](https://web.pulsar-edit.dev/packages/ide-fortran) provides Fortran language support using the [hansec's Fortran Language Server](https://github.com/hansec/fortran-language-server).
- [Haskell-hie](https://github.com/Tehnix/ide-haskell-hie) provides Haskell support via the [Haskell IDE Engine](https://github.com/haskell/haskell-ide-engine).
- [PHP](https://github.com/atom/ide-php) based on FelixFBecker's Language Server.
- [PowerShell](https://github.com/daviwil/ide-powershell) provides PowerShell language support using [PowerShell Editor Services](https://github.com/PowerShell/PowerShellEditorServices).
- [Python](https://github.com/lgeiger/ide-python) provides Python support via [Python Language Server](https://github.com/palantir/python-language-server).
- [Reason](https://github.com/zaaack/atom-ide-reason) provides OCaml and Reason support using [OCaml Language Server](https://github.com/freebroccolo/ocaml-language-server).
- [Rust](https://github.com/mehcode/atom-ide-rust) provides Rust support using [Rust Language Server](https://github.com/rust-lang-nursery/rls).
- [Scala](https://github.com/laughedelic/atom-ide-scala) provides Scala language support using [Metals](https://github.com/scalameta/metals) and [Dotty Language Server](http://dotty.epfl.ch/docs/usage/ide-support.html).
- [Vue](https://github.com/rwatts3/atom-ide-vue) provides Vue language support using the [Vue Language Server](https://www.npmjs.com/package/vue-language-server).

## Release Process

### Steps

1. Pull down the latest changes from `master`.
2. Edit [CHANGELOG.md](https://github.com/pulsar-edit/atom-languageclient/blob/master/CHANGELOG.md) to add relevant release notes for changes wince the previous release with a corresponding `## N.N.N` section header.
3. Add and commit CHANGELOG.md with message "Updated CHANGELOG for [version in format N.N.N]".
4. Run `npm run test` and verify that no tests failed.
5. Run `npm run flow` and verify that there are no errors.
6. Run `npm version [version type]` where the version type is `major`, `minor`, or `path` depending on the [semantic versioning](https://semver.org/) impact of the changes.
7. Run `git log -1` and make sure a commit was made for the new version (double-check version in package.json if you like).
8. If all looks good, run `npm publish` to publish the package.
9. Run `git push --tags` to push the new version tag to GitHub.
10. Go to the atom-languageclient [tags page](https://github.com/pulsar-edit/atom-languageclient/tags) and click "Add Release Notes" for the tag corresponding to the release you just published.
11. Paste the contents of your new CHANGELOG.md section, sans version header, into the "Describe this release" box.
12. Click the "Publish release" button.
13. 🎉
