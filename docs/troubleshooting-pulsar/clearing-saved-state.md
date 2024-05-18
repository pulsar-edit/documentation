---
title: Clearing saved state
layout: doc.ejs
---

Pulsar saves a number of things about your environment when you exit in order to
restore Pulsar to the same configuration when you next launch the program. In
some cases the state that gets saved can be something undesirable that prevents
Pulsar from working properly. In these cases, you may want to clear the state
that Pulsar has saved.

::: danger Danger

Clearing the saved state permanently destroys any state that Pulsar has saved
_across all projects_. This includes unsaved changes to files you may have been
editing in all projects. This is a destructive action.

:::

Clearing the saved state can be done by opening a terminal and executing:

```sh
$ pulsar --clear-window-state
```
