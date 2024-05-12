---
title: What is Pulsar?
layout: doc.ejs
---

There are a lot of text editors out there; why should you spend your time learning about and using Pulsar? Editors like Visual Studio Code offer convenience but are limited in their customizability. On the other end of the spectrum, Emacs and Vim offer extreme flexibility, but they aren't very approachable and can only be customized with special-purpose scripting languages.

Pulsar tries to bridge this gap by offering a zero-compromise combination of hackability and usability: an editor that will be welcoming to an elementary school student on their first day learning to code, but also a tool they won’t outgrow as they develop into seasoned hackers.

## The neutron star at the center of Pulsar

Pulsar itself runs within [Electron](https://www.electronjs.org/), a platform which combines the modern technologies of the Chromium browser rendering engine and Node.js to create cross-platform desktop applications built out of HTML, CSS, and JavaScript.

As a result, the packages that power Pulsar are able to be written with the same tools familiar to any Node or web developer.

## The history of Pulsar

Back in 2014, GitHub launched a cross-platform, free, and open-source text editor called **Atom**. To accomplish the tall task of supporting several operating systems from a single codebase, the Atom developers created an application framework that joined the Chromium browser engine onto Node.js. At the time, they called it Atom Shell.

Over time, the functionality of Atom Shell would expand, eventually becoming its own project called [Electron](https://www.electronjs.org/). Electron would surpass Atom itself in popularity, becoming the platform of choice for software like [GitHub Desktop](https://desktop.github.com/), [Visual Studio Code](https://code.visualstudio.com/), [Discord](https://discord.com/), and [Slack](https://slack.com/).

Atom’s momentum slowed somewhat in 2018 when GitHub was purchased by Microsoft. Releases continued, but no new major features followed, and the editor entered a long twilight period before its official sunset at the end of 2022.

Atom’s official sunset day was the same day as the first beta release of Pulsar. The Pulsar core team largely consisted of former contributors to the `atom-community` organization. The team grew a new community and attracted new maintainers in order to turn Pulsar into the editor it is today: a successor to Atom that shares its philosophy of being a community-led, hyper-hackable text editor.
