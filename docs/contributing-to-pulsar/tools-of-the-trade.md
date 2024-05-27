---
title: Tools of the trade
layout: doc.ejs
---

Since all of Pulsar is implemented using web technologies, in this section we’ll assume you know web technologies such as JavaScript and CSS.

While the majority of Pulsar is written in JavaScript, there are a few external modules that are still implemented in CoffeScript. All CoffeeScript that used to be present in the main Pulsar repository has been “decaffeinated” into JavaScript; you can [read more about that process here](https://github.com/pulsar-edit/.github/blob/main/guides/how-to-decaf.md).

The only remnant of CoffeeScript that remains in Pulsar itself is CSON — a JSON-like notation based on CoffeeScript. We’ve kept CSON as the default file format for settings files (like your config file and keymap file) because it’s not as strict about delimiters and it allows comments.

Less is like CSS with enhancements. (If you’ve used [Sass or SCSS](https://sass-lang.com/), Less will be familiar to you.) You can learn more about Less at [lesscss.org](http://lesscss.org/). But Less is a superset of CSS, so if you’re not familiar with Less you can just write CSS and you’ll be fine.
