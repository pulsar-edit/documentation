---
title: Creating your own Snippets
layout: doc.ejs
---

While we looked at Snippets earlier, what should you do if a package doesn't include a snippet or there's something custom to the code you write? Luckily it's incredibly easy to add your own snippets.

There is a text file in your
**_LNX/MAC_**: `~/.pulsar` -
**_WIN_**: `%USERPROFILE%\.pulsar`
directory called `snippets.cson` that contains all your custom snippets that are
loaded when you launch Pulsar. You can also easily open up that file by
selecting the
**_LNX_**: _Edit > Snippets_ -
**_MAC_**: _Pulsar > Snippets_ -
**_WIN_**: _File > Snippets_ menu.

## Snippet Format

So let's look at how to write a snippet. The basic snippet format looks like
this:

```coffee
'.source.js':
  'console.log':
    'prefix': 'log'
    'body': 'console.log(${1:"crash"});$2'
```

The leftmost keys are the selectors where these snippets should be active. The
easiest way to determine what this should be is to go to the language package of
the language you want to add a snippet for and look for the "Scope" string.

For example, if we wanted to add a snippet that would work for Java files, we
would look up the `language-java` package in our Settings view and we can see
the Scope is `source.java`. Then the top level snippet key would be that
prepended by a period (like a CSS class selector would do).

![Finding the selector scope for a snippet](/img/atom/snippet-scope.png "Finding the selector scope for a snippet")

The next level of keys are the snippet names. These are used for describing the
snippet in a more readable way in the snippet menu. You can name them whatever
you want.

Under each snippet name is a `prefix` that should trigger the snippet and a
`body` to insert when the snippet is triggered.

Each `$` followed by a number is a tab stop. Tab stops are cycled through by
pressing [[Tab]] once a snippet has been triggered.

Tab stops with the same number will create multiple cursors.

The above example adds a `log` snippet to JavaScript files that would expand to:

```javascript
console.log("crash");
```

The string `"crash"` would be initially selected and pressing tab again would
place the cursor after the `;`

::: warning Warning

Snippet keys, unlike CSS selectors, can only be repeated once per level. If
there are duplicate keys at the same level, then only the last one will be read.
See [Configuring with CSON](/customize-pulsar/configuring-with-cson/)
for more information.

:::

### Multi-line Snippet Body

You can also use [CoffeeScript multi-line syntax](http://coffeescript.org/#strings)
using `"""` for larger templates:

```coffee
'.source.js':
  'if, else if, else':
    'prefix': 'ieie'
    'body': """
      if (${1:true}) {
        $2
      } else if (${3:false}) {
        $4
      } else {
        $5
      }
    """
```

As you might expect, there is a snippet to create snippets. If you open up a
snippets file and type `snip` and then press [[Tab]], you will get the
following text inserted:

```coffee
'.source.js':
  'Snippet Name':
    'prefix': 'hello'
    'body': 'Hello World!'
```

Just fill that bad boy out and you have yourself a snippet. As soon as you
save the file, Pulsar should reload the snippets and you will immediately be
able to try it out.

### Multiple Snippets per Source

You can see below the format for including multiple snippets for the same scope
in your `snippets.cson` file. Just include the snippet name, prefix, and body
keys for additional snippets inside the scope key:

```coffee
'.source.gfm':
  'Hello World':
    'prefix': 'hewo'
    'body': 'Hello World!'

  'Github Hello':
    'prefix': 'gihe'
    'body': 'Octocat says Hi!'

  'Octocat Image Link':
    'prefix': 'octopic'
    'body': '![GitHub Octocat](https://assets-cdn.github.com/images/modules/logos_page/Octocat.png)'
```

Again, see [Configuring with CSON](/customize-pulsar/configuring-with-cson/)
for more information on CSON key structure and non-repeatability.

## More Info

The snippets functionality is implemented in the {snippets}
package.

For more examples, see the snippets in the [language-html](https://github.com/pulsar-edit/pulsar/tree/HEAD/packages/language-html/snippets/language-html.cson)
and [language-javascript](https://github.com/pulsar-edit/pulsar/tree/HEAD/packages/language-javascript/snippets/language-javascript.cson)
packages.
