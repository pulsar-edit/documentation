---
title: Check for linked Packages
layout: doc.ejs
---

If you develop or contribute to Pulsar packages, there may be left-over packages linked to your <span class="platform-mac platform-linux">`~/.pulsar/packages` or `~/.pulsar/dev/packages`</span> <span class="platform-win">`%USERPROFILE%\.pulsar\packages` or `%USERPROFILE%\.pulsar\dev\packages`</span>. directories. You can use the `pulsar -p links` command to list all linked packages:

```sh
$ pulsar -p links
> /Users/pulsy/.pulsar/dev/packages (0)
> └── (no links)
> /Users/pulsy/.pulsar/packages (1)
> └── color-picker -> /Users/pulsy/github/color-picker
```

You can remove links using the `pulsar -p unlink` command:

```sh
$ pulsar -p unlink color-picker
> Unlinking /Users/pulsy/.pulsar/packages/color-picker ✓
```

See `pulsar -p links --help` and `pulsar -p unlink --help` for more information on these commands.

::: tip Tip

You can also use `pulsar -p unlink --all` to easily unlink all packages and themes.

:::
