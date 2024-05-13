---
title: Configuring with CSON
layout: doc.ejs
---

All of Pulsar’s config files are written in CSON, short for [CoffeeScript Object Notation](https://github.com/bevry/cson#what-is-cson). Just like its namesake JSON, [JavaScript Object Notation](https://json.org/), CSON is a text format for storing structured data in the form of simple objects made up of key-value pairs.

```coffee
key:
  key: value
  key: value
  key: [value, value]
```

:::info
Pulsar’s predecessor Atom was originally written in CoffeeScript, but was slowly migrated to JavaScript over the years. Yet CSON has remained as a friendlier alternative to JSON files. It allows the user to use indentation in place of explicit delimiters like `{`/`}` and `,`, and it explicitly allows comments (which vanilla JSON does not).
:::

Objects are the backbone of any CSON file, and are delineated by indentation (as
in the above example). A key's value can either be a string, a number, an
object, a boolean, `null`, or an array of any of these data types.

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

Other than its optional delimiters, the main distinguishing feature of CSON is its string flexibility. Whereas JSON keys must always be single quoted, CSON keys can be single- or double-quoted — or even unquoted altogether (in situations where the equivalent key in a JavaScript object would not need quoting). And string values in CSON can be multi-line, as we’ve already seen, simply by using `"""` or `'''` as starting and ending delimiters:


```coffee
'.source.js':
  'class skeleton':
    'prefix': 'class'
    'body': """
      class ${1:Foo} {
        constructor($2) {
          $0
        }
      }
    """
```

On multi-line CSON strings, the string starts on the second line, and the leading whitespace on each line is ignored.
