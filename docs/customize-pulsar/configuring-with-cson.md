---
title: Configuring with CSON
layout: doc.ejs
---

All of Pulsar's config files (with the exception of your [style sheet](/customize-pulsar/style-tweaks/)
and your [Init Script](/customize-pulsar/the-init-file/) are written in CSON, short
for [CoffeeScript Object Notation](https://github.com/bevry/cson#what-is-cson).
Just like its namesake JSON, [JavaScript Object Notation](https://json.org/),
CSON is a text format for storing structured data in the form of simple objects
made up of key-value pairs.

```coffee
key:
  key: value
  key: value
  key: [value, value]
```

Objects are the backbone of any CSON file, and are delineated by indentation (as
in the above example). A key's value can either be a String, a Number, an
Object, a Boolean, `null`, or an Array of any of these data types.

::: warning Warning

Just like the more common JSON, CSON's keys can only be repeated once per
object. If there are duplicate keys, then the last usage of that key overwrites
all others, as if they weren't there. The same holds true for Pulsar's config
files.

**Don't do this:**

```coffee
# Only the second snippet will be loaded
'.source.js':
  'console.log':
    'prefix': 'log'
    'body': 'console.log(${1:"crash"});$2'
'.source.js':
  'console.error':
    'prefix': 'error'
    'body': 'console.error(${1:"crash"});$2'
```

**Use this instead:**

```coffee
# Both snippets will be loaded
'.source.js':
  'console.log':
    'prefix': 'log'
    'body': 'console.log(${1:"crash"});$2'
  'console.error':
    'prefix': 'error'
    'body': 'console.error(${1:"crash"});$2'
```

:::
