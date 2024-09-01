---
title: GitHub Package Wiki
layout: doc.ejs
---

The following wiki article is a small piece of Pulsar/Atom's history.
This wiki entry was taken directly from the [`atom/github` package wiki](https://github.com/atom/github/wiki) and is mirrored here in case that ever becomes inaccessible.

::: warning Warning

The contents of this article do not in any way represent actions, thoughts or ideas expressed by the Pulsar team.
Full credit for the content of the below page belongs to [@Katrina Uychaco](https://github.com/kuychaco) and [@Michelle Tilley](https://github.com/BinaryMuse).

:::

## Roadmaps

[Short Term Roadmap](https://github.com/atom/github/projects/8)

## Monthly Planning

### June 2017

## Looking Back

- Beta launch went very well
- Relatively few problems
- Performance work [@smashwilson](https://github.com/smashwilson) and [@kuychaco](https://github.com/kuychaco) did is ✨
- GPG/credential helper work that [@smashwilson](https://github.com/smashwilson) shipped was solid
- Feeling good about shipping to stable

## This Month

- Ensure room to triage and fix issues that may arise after shipping to stable
- File change notification service [@smashwilson](https://github.com/smashwilson)
- GitHub integration [@BinaryMuse](https://github.com/BinaryMuse) [@kuychaco](https://github.com/kuychaco)
  - Create new PR
  - Fill out existing functionality (timeline item types, new fields, etc.)
  - Add mechanism for manual/auto refreshing
  - Continue to investigate possibility of real-time updates
- Git integration [@kuychaco](https://github.com/kuychaco)
  - Add "last commit(s)" view under commit box
  - Investigate removing amend checkbox in favor of more robust HEAD management

## Other Topics Discussed

- Web Workers
  - Wait to see if issues arise with current implementation
- Better remote/branch management
  - Existing UI mocks are relatively old and pre-docks
  - Want to ensure what we ship is close to what we'll want long term to ensure UI/UX stability over time
  - Resume conversation around design and pick this up in coming months
- `core:undo` support
  - Undo support is a misnomer in a system where there's not a linear set of edits
  - Want to design a system where any action is recoverable (different from undoable)
  - Really talking about UI Git porcelain at this point
  - Start deeper conversations now, talk about more at mini-summit
- Git log / graph
  - We could do something simple now very quickly but would it be up to the standards we want?
  - Decided to work on "last commit(s)" view for June, talk about this more at mini-summit
- Stash support
  - Start talking about UI/UX
- Additional GitHub PR work
  - "Checking out" a PR from the GH pane is a great first step toward implementing a full code review flow
