---
title: Integrate with Autocomplete Plus
layout: doc.ejs
---

## Provider API - Docs for writing your own provider

The Provider API allows you to make autocomplete+ awesome. The Pulsar community will ultimately judge the quality of Pulsar's autocomplete experience by the breadth and depth of the provider ecosystem. We're so excited that you're here reading about how to make Pulsar awesome.

### Defining a Provider

```coffeescript
provider =
  # This will work on JavaScript and CoffeeScript files, but not in js comments.
  selector: '.source.js, .source.coffee'
  disableForSelector: '.source.js .comment'

  # This will take priority over the default provider, which has an inclusionPriority of 0.
  # `excludeLowerPriority` will suppress any providers with a lower priority
  # i.e. The default provider will be suppressed
  inclusionPriority: 1
  excludeLowerPriority: true

  # This will be suggested before the default provider, which has a suggestionPriority of 1.
  suggestionPriority: 2

  # Let autocomplete+ filter and sort the suggestions you provide.
  filterSuggestions: true

  # Required: Return a promise, an array of suggestions, or null.
  getSuggestions: ({editor, bufferPosition, scopeDescriptor, prefix, activatedManually}) ->
    new Promise (resolve) ->
      resolve([text: 'something'])

  # (optional): (*experimental*) called when the user selects a suggestion for
  # the purpose of loading additional information about the suggestion.
  getSuggestionDetailsOnSelect: (suggestion) ->
    new Promise (resolve) ->
      resolve(newSuggestion)

  # (optional): called _after_ the suggestion `replacementPrefix` is replaced
  # by the suggestion `text` in the buffer
  onDidInsertSuggestion: ({editor, triggerPosition, suggestion}) ->

  # (optional): called when your provider needs to be cleaned up. Unsubscribe
  # from things, kill any processes, etc.
  dispose: ->
```

The properties of a provider:
* `selector` (required): Defines the scope selector(s) (can be comma-separated) for which your provider should receive suggestion requests
* `getSuggestions` (required): Is called when a suggestion request has been dispatched by `autocomplete+` to your provider. Return an array of suggestions (if any) in the order you would like them displayed to the user. Returning a Promise of an array of suggestions is also supported.
* `getSuggestionDetailsOnSelect` (optional): (*experimental*) Is called when a suggestion is selected by the user for the purpose of loading more information about the suggestion. Return a Promise of the new suggestion to replace it with or return `null` if no change is needed.
* `disableForSelector` (optional): Defines the scope selector(s) (can be comma-separated) for which your provider should not be used
* `inclusionPriority` (optional): A number to indicate its priority to be included in a suggestions request. The default provider has an inclusion priority of `0`. Higher priority providers can suppress lower priority providers with `excludeLowerPriority`.
* `excludeLowerPriority` (optional): Will not use lower priority providers when this provider is used.
* `suggestionPriority` (optional): A number to determine the sort order of suggestions. The default provider has a suggestion priority of `1`
* `filterSuggestions` (optional): If set to `true`, `autocomplete+` will preform fuzzy filtering and sorting on the list of matches returned by `getSuggestions`.
* `dispose` (optional): Will be called if your provider is being destroyed by `autocomplete+`
* `onDidInsertSuggestion` (optional): Function that is called when a suggestion from your provider was inserted into the buffer.
  - `editor`: The {TextEditor} your suggestion was inserted in
  - `triggerPosition`: A {Point} where autocomplete was triggered
  - `suggestion`: The suggestion object that was inserted

### Support for Asynchronous Request Handling

Some providers satisfy a suggestion request in an asynchronous way (e.g. it may need to dispatch request to an external process to get suggestions). To asynchronously provide suggestions, simply return a `Promise` from your `getSuggestions`:

```coffeescript
getSuggestions: (options) ->
  return new Promise (resolve) ->
    # Build your suggestions here asynchronously...
    resolve(suggestions) # When you are done, call resolve and pass your suggestions to it
```

### The Suggestion Request's Options Object

An `options` object will be passed to your `getSuggestions` function, with the following properties:
* `editor`: The current {TextEditor}
* `bufferPosition`: The position of the cursor
* `scopeDescriptor`: The {ScopeDescriptor} for the current cursor position
* `prefix`: The word characters immediately preceding the current cursor position
* `activatedManually`: Whether the autocomplete request was initiated by the user (e.g. with [[Ctrl+Space]])

### Suggestions

```coffeescript
provider =
  selector: '.source.js, .source.coffee'
  disableForSelector: '.source.js .comment'

  getSuggestions: ({editor, bufferPosition, scopeDescriptor, prefix}) ->
    new Promise (resolve) ->
      # Find your suggestions here
      suggestion =
        text: 'someText' # OR
        snippet: 'someText(${1:myArg})'
        displayText: 'someText' # (optional)
        replacementPrefix: 'so' # (optional)
        type: 'function' # (optional)
        leftLabel: '' # (optional)
        leftLabelHTML: '' # (optional)
        rightLabel: '' # (optional)
        rightLabelHTML: '' # (optional)
        className: '' # (optional)
        iconHTML: '' # (optional)
        description: '' # (optional)
        descriptionMoreURL: '' # (optional)
        characterMatchIndices: [0, 1, 2] # (optional)
      resolve([suggestion])
```

Your suggestions should be returned from `getSuggestions` as an array of objects with the following properties:
* `text` (required; or `snippet`): The text which will be inserted into the editor, in place of the prefix.
* `snippet` (required; or `text`): A snippet string. This will allow users to tab through function arguments or other options. e.g. `'myFunction(${1:arg1}, ${2:arg2})'`. See the {snippets} package for more information.
* `displayText` (optional): A string that will show in the UI for this suggestion. When not set, `snippet || text` is displayed. This is useful when `snippet` or `text` displays too much, and you want to simplify. e.g. `{type: 'attribute', snippet: 'class="$0"$1', displayText: 'class'}`
* `replacementPrefix` (optional): The text immediately preceding the cursor, which will be replaced by the `text`. If not provided, the prefix passed into `getSuggestions` will be used
* `type` (optional): The suggestion type, it will be converted into an icon shown against the suggestion. Predefined styles exist for `variable`, `constant`, `property`, `value`, `method`, `function`, `class`, `type`, `keyword`, `tag`, `snippet`, `import`, `require`. This list represents nearly everything being colorized.
* `leftLabel` (optional): This is shown before the suggestion. Useful for return values.
* `leftLabelHTML` (optional): Use this instead of `leftLabel` if you want to use html for the left label.
* `rightLabel` (optional): An indicator (e.g. `function`, `variable`) denoting the "kind" of suggestion this represents.
* `rightLabelHTML` (optional): Use this instead of `rightLabel` if you want to use html for the right label.
* `className` (optional): Class name for the suggestion in the suggestion list. Allows you to style your suggestion via CSS, if desired.
* `iconHTML` (optional): If you want complete control over the icon shown against the suggestion. e.g. `iconHTML: '<i class="icon-move-right"></i>'`. THe background color of the icon will still be determined (by default) from the `type`.
* `description` (optional): A doc-string summary or short description of the suggestion. WHen specified, it will be displayed at the bottom of the suggestions list.
* `descriptionMoreURL` (optional): A url to the documentation or more information about this suggestion. WHen specified, a `More..` link will be displayed in the description area.
![autocomplete-description](./autocomplete-description.jpg)
* `characterMatchIndices` (optional): A list of indexes where the characters in the prefix appear in this suggestion's text. e.g. "foo" in "foo_bar" would be `[0, 1, 2]`.

### Registering your provider with `autocomplete+`

#### API 4.0.0

In your `package.json` add:

```javascript
"providedServices": {
  "autocomplete.provider": {
    "versions": {
      "4.0.0": "provide"
    }
  }
}
```

THen, in your `main.coffee` (or whatever file you define as your `main` in `package.json` i.e. `"main": "./lib/your-main"` would imply `your-main.coffee`), add the following:

For a single provider:

```coffeescript
module.exports =
  provide: -> @yourProviderHere
```

For multiple providers, just return an array:

```coffeescript
module.exports =
  provide: -> [@yourProviderHere, @yourOtherProviderHere]
```

### Provider Examples

These providers are bundled within the Pulsar repository:

* {autocomplete-css}
* {autocomplete-html}
* {autocomplete-snippets}

Check out the lib directory in each of these for the code!

### Tips

#### Generating a new prefix

The `prefix` passed to `getSuggestions` may not be sufficient for your language. You may need to generate your own prefix. Here is a pattern to use your own prefix:

```coffeescript
provider =
  selector: '.source.js, .source.coffee'

  getSuggestions: ({editor, bufferPosition}) ->
    prefix = @getPrefix(editor, bufferPosition)

    new Promise (resolve) ->
      suggestion =
        text: 'someText'
        replacementPrefix: prefix
      resolve([suggestion])

  getPrefix: (editor, bufferPosition) ->
    # Whatever your prefix regex might be
    regex = /[\w0-9_-]+$

    # Get the text for the line up to the triggered buffer position
    line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])

    # Match the regex to the line, and return the match
    line.match(regex)?[0] or ''
```

## SymbolProvider Config API - Docs for supporting your language in the default `SymbolProvider`

The builtin `SymbolProvider` allows showing the types of symbols in the suggestion list.

![symbol-provider-notes](./symbol-provider-notes.jpg)

The icon colors are intended to match the syntax color of the symbol type. e.g. functions are blue in this theme, so the function icon is also blue.

Each language can tune how the `SymbolProvider` tags symbols by modifying the [config of the language package](https://github.com/pulsar-edit/language-coffee-script/blob/d86c8963dcee0ab811da05a175b2218045d0c124/settings/language-coffee-script.cson#L5).

```coffeescript
# An example for the CoffeeScript language
'.source.coffee':
  autocomplete:
    symbols:
      class:
        selector: '.class.name, .inherited-class, .instance.type'
        typePriority: 4
      function:
        selector: '.function.name'
        typePriority: 3
      variable:
        selector: '.variable'
        typePriority: 2
      '': # the catch-all
        selector: '.source'
        typePriority: 1
      builtin:
        suggestions: [
          'one'
          'two'
        ]
```

A more generic example:

```coffeescript
'.source.language':
  autocomplete:
    symbols:
      typename1:
        selector: '.some, .selectors'
        typePriority: 1
      typename2:
        suggestions: [...]
      typename3:
        ...
```

Any number of Typename objects are supported, and `typename` can be anything you choose. However, you are encouraged to use one of the predefined `typenames`. There are predefined styles for the following types:

* `bultin`
* `class`
* `constant`
* `function`
* `import`
* `keyword`
* `method`
* `module`
* `mixin`
* `package`
* `property`
* `require`
* `snippet`
* `tag`
* `type`
* `value`
* `variable`

### Typename Objects

Typename objects support the following properties:

* `selector`: The selector that matches your symbol types. e.g. `'.variable.name'`. You can also have several selectors separated by commas, just like in CSS `'.variable.name, .storage.variable'`
* `typePriority`: The priority this Typename object has over others. e.g. in our CoffeeScript example above, if a symbol is tagged with the `function` type in one part of the code, but `class` in another part of the code, it will be displayed to the user as a `class` because `class` has a higher `typePriority`
* `suggestions`: This allows you to specify explicit completions for some scope. A good use is builtins: e.g. `['Math', 'Array', ...]` in JavaScript.
  - Items in the `suggestions` list can also be objects using any of the [properties](#suggestions) from the provider API.

### Finding Scope Selectors

Coming up with the selectors for a given Typename object might be the hardest part of defining the `autocomplete.symbols` config. Fortunately there is a tool to help.

Open the {Command Palette}, then search for `log cursor scope`. You will be presented with a blue box like the following:

![scopenames](./scopename.png)

Each bullet in the box is a node. The last bullet is the symbol itself, and each preceding line is a parent of the symbol &mdash; just like CSS. With this information, you can see that the symbol can be matched with several selectors: `'.variable'`, `'.variable.assignment'`, `'.source.coffee .variable'`, etc.

## Autocomplete Providers - A list of the providers out there

::: warning Warning

The below list was originally pulled from the [`atom/autocomplete-plus` wiki](https://github.com/atom/autocomplete-plus/wiki/Autocomplete-Providers) and has not been updated sense. It is still a wonderful starting point to find out about the different autocompletion providers that exist, but it should not be considering comprehensive.

:::

While this list serves as a jumping off point into known quality packages, the Pulsar Package Registry allows you to easily [search](https://web.pulsar-edit.dev/packages?serviceType=provided&service=autocomplete.provider) for all Autocomplete Providers published.

### Built-In Providers

| Grammar | Selector | Provider         | Status             |
| :------ | :------- | :--------------- | :----------------- |
| All     | `*`      | `SymbolProvider` | `Default Provider` |
| All     | `*`      | `FuzzyProvider`  | `Deprecated`       |

### Providers for Built-In Grammars

| Grammar                                                                          | Selector                             | Provider                                                                                                                                                                                                                           | API Status |
| :------------------------------------------------------------------------------- | :----------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| Null Grammar                                                                     | `.text.plain.null-grammar`           | &nbsp;                                                                                                                                                                                                                             | &nbsp;     |
| [CoffeeScript (Literate)](https://web.pulsar-edit.dev/packages/language-coffee-script)       | `.source.litcoffee`                  |                                                                                                                                                                                                                                    |            |
| [CoffeeScript](https://web.pulsar-edit.dev/packages/language-coffee-script)                  | `.source.coffee`                     |                                                                                                                                                                                                                                    |            |
| [JSON](https://web.pulsar-edit.dev/packages/language-json)                                   | `.source.json`                       |                                                                                                                                                                                                                                    |            |
| [Shell Session](https://web.pulsar-edit.dev/packages/language-shellscript)                   | `.text.shell-session`                |                                                                                                                                                                                                                                    |            |
| [Shell Script](https://web.pulsar-edit.dev/packages/language-shellscript)                    | `.source.shell`                      |                                                                                                                                                                                                                                    |            |
| [Hyperlink](https://web.pulsar-edit.dev/packages/language-hyperlink)                         | `.text.hyperlink`                    |                                                                                                                                                                                                                                    |            |
| [TODO](https://web.pulsar-edit.dev/packages/language-todo)                                   | `.text.todo`                         |                                                                                                                                                                                                                                    |            |
| [C](https://web.pulsar-edit.dev/packages/language-c)                                         | `.source.c`                          | [autocomplete-clang](https://web.pulsar-edit.dev/packages/autocomplete-clang)                                                                                                                                                                  |
| [C++](https://web.pulsar-edit.dev/packages/language-c)                                       | `.source.cpp`                        | [autocomplete-clang](https://web.pulsar-edit.dev/packages/autocomplete-clang)                                                                                                                                                                  | `2.0.0`    |
| [Clojure](https://web.pulsar-edit.dev/packages/language-clojure)                             | `.source.clojure`                    | [proto-repl](https://web.pulsar-edit.dev/packages/proto-repl)                                                                                                                                                                                  |            |
| [CSS](https://web.pulsar-edit.dev/packages/language-css)                                     | `.source.css`                        | [autocomplete-css](https://web.pulsar-edit.dev/packages/autocomplete-css)                                                                                                                                                                      | `2.0.0`    |
| [GitHub Markdown](https://web.pulsar-edit.dev/packages/language-gfm)                         | `.source.gfm`                        | [autocomplete-bibtex](https://web.pulsar-edit.dev/packages/autocomplete-bibtex)                                                                                                                                                                | `1.1.0`    |
| [Git Config](https://web.pulsar-edit.dev/packages/language-git)                              | `.source.git-config`                 |                                                                                                                                                                                                                                    |            |
| [Git Commit Message](https://web.pulsar-edit.dev/packages/language-git)                      | `.text.git-commit`                   |                                                                                                                                                                                                                                    |            |
| [Git Rebase Message](https://web.pulsar-edit.dev/packages/language-git)                      | `.text.git-rebase`                   |                                                                                                                                                                                                                                    |            |
| [HTML (Go)](https://web.pulsar-edit.dev/packages/language-go)                                | `.text.html.gohtml`                  |                                                                                                                                                                                                                                    |            |
| [Go](https://web.pulsar-edit.dev/packages/language-go)                                       | `.source.go`                         | [go-plus](https://web.pulsar-edit.dev/packages/go-plus), [autocomplete-go](https://web.pulsar-edit.dev/packages/autocomplete-go)                                                                                                                           | `2.0.0`    |
| [Go Template](https://web.pulsar-edit.dev/packages/language-go)                              | `.source.gotemplate`                 |                                                                                                                                                                                                                                    |            |
| [HTML](https://web.pulsar-edit.dev/packages/language-html)                                   | `.text.html.basic`                   | [autocomplete-html](https://web.pulsar-edit.dev/packages/autocomplete-html)                                                                                                                                                                    | `2.0.0`    |
| [JavaScript](https://web.pulsar-edit.dev/packages/language-javascript)                       | `.source.js`                         | [atom-ternjs](https://web.pulsar-edit.dev/packages/atom-ternjs)                                                                                                                                                                                | `2.0.0`    |
| [Java Properties](https://web.pulsar-edit.dev/packages/language-java)                        | `.source.java-properties`            |                                                                                                                                                                                                                                    |            |
| [Regular Expressions (JavaScript)](https://web.pulsar-edit.dev/packages/language-javascript) | `.source.js.regexp`                  |                                                                                                                                                                                                                                    |            |
| [JavaServer Pages](https://web.pulsar-edit.dev/packages/language-java)                       | `.text.html.jsp`                     | [autocomplete-jsp](https://web.pulsar-edit.dev/packages/autocomplete-jsp)                                                                                                                                                                      | `2.0.0`    |
| [Java](https://web.pulsar-edit.dev/packages/language-java)                                   | `.source.java`                       | [autocomplete-java-minus](https://web.pulsar-edit.dev/packages/autocomplete-java-minus)                                                                                                                                                        | `2.0.0`    |
| [JUnit Test Report](https://web.pulsar-edit.dev/packages/language-java)                      | `.text.junit-test-report`            |                                                                                                                                                                                                                                    |            |
| [Makefile](https://web.pulsar-edit.dev/packages/language-make)                               | `.source.makefile`                   |                                                                                                                                                                                                                                    |            |
| [LESS](https://web.pulsar-edit.dev/packages/language-less)                                   | `.source.css.less`                   |                                                                                                                                                                                                                                    |            |
| [SQL (Mustache)](https://web.pulsar-edit.dev/packages/language-mustache)                     | `.source.sql.mustache`               |                                                                                                                                                                                                                                    |            |
| [HTML (Mustache)](https://web.pulsar-edit.dev/packages/language-mustache)                    | `.text.html.mustache`                |                                                                                                                                                                                                                                    |            |
| [Objective-C++](https://web.pulsar-edit.dev/packages/language-objective-c)                   | `.source.objcpp`                     | [autocomplete-clang](https://web.pulsar-edit.dev/packages/autocomplete-clang)                                                                                                                                                                  |            |
| [Strings File](https://web.pulsar-edit.dev/packages/language-objective-c)                    | `.source.strings`                    |                                                                                                                                                                                                                                    |            |
| [Objective-C](https://web.pulsar-edit.dev/packages/language-objective-c)                     | `.source.objc`                       | [autocomplete-clang](https://web.pulsar-edit.dev/packages/autocomplete-clang)                                                                                                                                                                  |            |
| [Property List (XML)](https://web.pulsar-edit.dev/packages/language-property-list)           | `.text.xml.plist`                    |                                                                                                                                                                                                                                    |            |
| [Property List (Old-Style)](https://web.pulsar-edit.dev/packages/language-property-list)     | `.source.plist`                      |                                                                                                                                                                                                                                    |            |
| [Perl](https://web.pulsar-edit.dev/packages/language-perl)                                   | `.source.perl`                       |                                                                                                                                                                                                                                    |            |
| [PHP](https://web.pulsar-edit.dev/packages/language-php)                                     | `.text.html.php`                     |                                                                                                                                                                                                                                    |            |
| PHP                                                                              | `.source.php`                        | [php-integrator-autocomplete-plus](https://github.com/php-integrator/atom-autocompletion), [atom-autocomplete-php](https://github.com/Peekmo/atom-autocomplete-php), [autocomplete-php](https://web.pulsar-edit.dev/packages/autocomplete-php) | `2.0.0`    |
| [Python Console](https://web.pulsar-edit.dev/packages/language-python)                       | `.text.python.console`               |                                                                                                                                                                                                                                    |            |
| [Python Traceback](https://web.pulsar-edit.dev/packages/language-python)                     | `.text.python.traceback`             |                                                                                                                                                                                                                                    |            |
| [Regular Expressions (Python)](https://web.pulsar-edit.dev/packages/language-python)         | `.source.regexp.python`              |                                                                                                                                                                                                                                    |            |
| [Python](https://web.pulsar-edit.dev/packages/language-python)                               | `.source.python`                     | [autocomplete-python](https://web.pulsar-edit.dev/packages/autocomplete-python), [autocomplete-python-jedi](https://web.pulsar-edit.dev/packages/autocomplete-python-jedi)                                                                                 |            |
| [Ruby on Rails (RJS)](https://web.pulsar-edit.dev/packages/language-ruby-on-rails)           | `.source.ruby.rails.rjs`             |                                                                                                                                                                                                                                    |            |
| [Ruby](https://web.pulsar-edit.dev/packages/language-ruby)                                   | `.source.ruby`                       |                                                                                                                                                                                                                                    |            |
| [HTML (Ruby - ERB)](https://web.pulsar-edit.dev/packages/language-ruby)                      | `.text.html.erb`                     |                                                                                                                                                                                                                                    |            |
| [HTML (Rails)](https://web.pulsar-edit.dev/packages/language-ruby-on-rails)                  | `.text.html.ruby`                    |                                                                                                                                                                                                                                    |            |
| [SQL (Rails)](https://web.pulsar-edit.dev/packages/language-ruby-on-rails)                   | `.source.sql.ruby`                   |                                                                                                                                                                                                                                    |            |
| [JavaScript (Rails)](https://web.pulsar-edit.dev/packages/language-ruby-on-rails)            | `.source.js.rails .source.js.jquery` |                                                                                                                                                                                                                                    |            |
| [Ruby on Rails](https://web.pulsar-edit.dev/packages/language-ruby-on-rails)                 | `.source.ruby.rails`                 |                                                                                                                                                                                                                                    |            |
| [Sass](https://web.pulsar-edit.dev/packages/language-sass)                                   | `.source.sass`                       |                                                                                                                                                                                                                                    |            |
| [Plain Text](https://web.pulsar-edit.dev/packages/language-text)                             | `.text.plain`                        |                                                                                                                                                                                                                                    |            |
| [SCSS](https://web.pulsar-edit.dev/packages/language-sass)                                   | `.source.css.scss`                   |                                                                                                                                                                                                                                    |            |
| [SQL](https://web.pulsar-edit.dev/packages/language-sql)                                     | `.source.sql`                        | [autocomplete-sql](https://web.pulsar-edit.dev/packages/autocomplete-sql)                                                                                                                                                                      | `2.0.0`    |
| [TOML](https://web.pulsar-edit.dev/packages/language-toml)                                   | `.source.toml`                       |                                                                                                                                                                                                                                    |            |
| [XSL](https://web.pulsar-edit.dev/packages/language-xml)                                     | `.text.xml.xsl`                      |                                                                                                                                                                                                                                    |            |
| [XML](https://web.pulsar-edit.dev/packages/language-xml)                                     | `.text.xml`                          | [autocomplete-xml](https://github.com/pleonex/atom-autocomplete-xml)                                                                                                                                                               | `2.0.0`    |
| [YAML](https://web.pulsar-edit.dev/packages/language-yaml)                                   | `.source.yaml`                       |                                                                                                                                                                                                                                    |            |
## Providers For Third-Party Grammars

| Grammar                                                                                                                                                         | Selector                                | Provider                                                                                                                                                                                                                                          | API Status |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------- |
| [Apex](https://web.pulsar-edit.dev/packages/mavensmate-atom)                                                                                                                | `.source.apex`                          | [mavensmate-atom](https://web.pulsar-edit.dev/packages/mavensmate-atom)                                                                                                                                                                                       | `1.0.0`    |
| [AsciiDoc](https://web.pulsar-edit.dev/packages/language-asciidoc)                                                                                                          | `.source.asciidoc`                      | [autocomplete-asciidoc](https://web.pulsar-edit.dev/packages/autocomplete-asciidoc)                                                                                                                                                                           | `2.0.0`    |
| [C#](https://web.pulsar-edit.dev/packages/language-csharp)                                                                                                                  | `.source.cs`                            | [omnisharp-atom](https://web.pulsar-edit.dev/packages/omnisharp-atom)                                                                                                                                                                                         | `2.0.0`    |
| [ComputerCraft](https://web.pulsar-edit.dev/packages/language-computercraft)                                                                                                | `.source.computercraft`                 | [autocomplete-computercraft](https://web.pulsar-edit.dev/packages/autocomplete-computercraft)                                                                                                                                                                 | `1.0.0`    |
| [Curry](https://web.pulsar-edit.dev/packages/language-curry)                                                                                                                | `.source.curry`                         | [autocomplete-curry](https://web.pulsar-edit.dev/packages/autocomplete-curry)                                                                                                                                                                                 | `4.0.0`    |
| [Dart](https://github.com/radicaled/dart-tools)                                                                                                                 | `.source.dart`                          | [dart-tools](https://github.com/radicaled/dart-tools)                                                                                                                                                                                             |
| [Dart](https://github.com/dart-atom/dartlang)                                                                                                                   | `.source.dart`                          | [dartlang](https://github.com/dart-atom/dartlang)                                                                                                                                                                                                 |
| [Elixir](https://web.pulsar-edit.dev/packages/language-elixir)                                                                                                              | `.source.elixir`                        | [autocomplete-elixir](https://web.pulsar-edit.dev/packages/autocomplete-elixir)                                                                                                                                                                               | `2.0.0`    |
| [Erlang](https://web.pulsar-edit.dev/packages/language-erlang)                                                                                                              | `.source.erlang`                        | [autocomplete-erlang](https://web.pulsar-edit.dev/packages/autocomplete-erlang)                                                                                                                                                                               | `2.0.0`    |
| [GLSL](https://web.pulsar-edit.dev/packages/language-glsl)                                                                                                                  | `.source.glsl`                          | [autocomplete-glsl](https://web.pulsar-edit.dev/packages/autocomplete-glsl)                                                                                                                                                                                   | `2.0.0`    |
| [HackLang](https://web.pulsar-edit.dev/packages/language-hack)                                                                                                              | `.source.hack`                          | [autocomplete-hack](https://web.pulsar-edit.dev/packages/autocomplete-hack)                                                                                                                                                                                   | `2.0.0`    |
| [Haskell](https://web.pulsar-edit.dev/packages/language-haskell)                                                                                                            | `.source.haskell`                       | [autocomplete-haskell](https://web.pulsar-edit.dev/packages/autocomplete-haskell)                                                                                                                                                                             | `1.0.0`    |
| [Haskell](https://web.pulsar-edit.dev/packages/language-haskell)                                                                                                            | `.source.haskell`                       | [ide-haskell](https://web.pulsar-edit.dev/packages/ide-haskell)                                                                                                                                                                                               | `1.0.0`    |
| [Haxe](https://web.pulsar-edit.dev/packages/language-haxe)                                                                                                                  | `.source.haxe`                          | [autocomplete-haxe](https://web.pulsar-edit.dev/packages/autocomplete-haxe)                                                                                                                                                                                   | `1.1.0`    |
| [LaTeX](https://web.pulsar-edit.dev/packages/language-latex)                                                                                                                | `.text.tex.latex`                       | [autocomplete-latex-cite](https://web.pulsar-edit.dev/packages/autocomplete-latex-cite), [autocomplete-latex-references](https://web.pulsar-edit.dev/packages/autocomplete-latex-references), [autocomplete-glossaries](https://web.pulsar-edit.dev/packages/autocomplete-glossaries) | `2.0.0`    |
| [Marko](https://github.com/marko-js/atom-language-marko)                                                                                                        | `.text.marko`                           | [autocomplete-marko](https://github.com/marko-js/atom-autocomplete-marko)                                                                                                                                                                         | `2.0.0`    |
| [Nunjucks](https://github.com/alohaas/language-nunjucks)                                                                                                        | `.source.nunjucks, .text.html.nunjucks` | [autocomplete-nunjucks](https://github.com/puranjayjain/autocomplete-nunjucks)                                                                                                                                                                    | `2.0.0`    |
| [Pig](https://web.pulsar-edit.dev/packages/pig)                                                                                                                             | `.source.pig`                           | [pig](https://web.pulsar-edit.dev/packages/pig)                                                                                                                                                                                                               | `2.0.0`    |
| [Q/K](https://web.pulsar-edit.dev/packages/language-kdb-q)                                                                                                                  | `.source.q`                             | [autocomplete-kdb-q](https://web.pulsar-edit.dev/packages/autocomplete-kdb-q)                                                                                                                                                                                 | `2.0.0`    |
| [Rust](https://web.pulsar-edit.dev/packages/language-rust)                                                                                                                  | `.source.rust`                          | [racer](https://web.pulsar-edit.dev/packages/racer)                                                                                                                                                                                                           | `2.0.0`    |
| [Turtle](https://web.pulsar-edit.dev/packages/language-rdf)                                                                                                                 | `.source.turtle`                        | [turtle-completer](https://web.pulsar-edit.dev/packages/turtle-completer)                                                                                                                                                                                     | `2.0.0`    |
| [TypeScript](https://web.pulsar-edit.dev/packages/atom-typescript)                                                                                                          | `.source.ts`                            | [atom-typescript](https://web.pulsar-edit.dev/packages/atom-typescript)                                                                                                                                                                                       | `8.11.0`   |
| [Visualforce](https://web.pulsar-edit.dev/packages/mavensmate-atom)                                                                                                         | `.visualforce`                          | [mavensmate-atom](https://web.pulsar-edit.dev/packages/mavensmate-atom)                                                                                                                                                                                       | `1.1.0`    |
| [WordPress Coding Standard Whitelist Flags](https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/wiki/Whitelisting-code-which-flags-errors) | `.php .comment`                         | [autocomplete-wpcs-flags](https://web.pulsar-edit.dev/packages/autocomplete-wpcs-flags)                                                                                                                                                                       | `2.0.0`    |

## Providers Not Tied To A Specific Grammar

| Selector                                                                                | Provider                                                                  | Status  |
| :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :------ |
| `*`                                                                                     | [autocomplete-emojis](https://web.pulsar-edit.dev/packages/autocomplete-emojis)       | `1.0.0` |
| `*`                                                                                     | [autocomplete-snippets](https://web.pulsar-edit.dev/packages/autocomplete-snippets)   | `2.0.0` |
| `*`                                                                                     | [autocomplete-paths](https://web.pulsar-edit.dev/packages/autocomplete-paths)         | `1.0.0` |
| `*`                                                                                     | [atom-path-intellisense](https://web.pulsar-edit.dev/packages/atom-path-intellisense) | `1.2.1` |
| `*`                                                                                     | [atom-ctags](https://web.pulsar-edit.dev/packages/atom-ctags)                         | `2.0.0` |
| `.source.js, .source.jsx`                                                               | [ide-flow](https://web.pulsar-edit.dev/packages/ide-flow)                             | `1.1.0` |
| `.source.js, .source.jsx, .source.coffee`                                               | [autocomplete-underdash](https://web.pulsar-edit.dev/packages/autocomplete-underdash) | `2.0.0` |
| `.source.css`, `.source.css.less`, `.source.sass`, `.source.css.scss`, `.source.stylus` | [project-palette-finder](https://web.pulsar-edit.dev/packages/project-palette-finder) | `1.1.0` |
| `*`                                                                                     | [you-complete-me](https://web.pulsar-edit.dev/packages/you-complete-me)               | `2.0.0` |
| `English word autocompletion with the hint of explanation.`                              | [autocomplete-en-en](https://web.pulsar-edit.dev/packages/autocomplete-en-en)         | `2.0.0` |

--

## Providers Requested By The Community

If you'd like to contribute and are interested in learning how to write an `autocomplete-plus` [`Provider`](#provider-api---docs-for-writing-your-own-provider), start here:

- Emmet: https://github.com/atom/autocomplete-plus/issues/156
- LESS: https://github.com/atom/autocomplete-plus/issues/151

## Packages That Claim Autocomplete, But Are Not API 1.0.0 Compatible

- https://github.com/maun/atom-rust-plus (never published, uses [autocomplete-plus-async](https://web.pulsar-edit.dev/packages/autocomplete-plus-async))
- https://web.pulsar-edit.dev/packages/ios (doesn't make use of autocomplete-plus)
- https://web.pulsar-edit.dev/packages/language-hn (see: https://github.com/ignaciocases/language-hn/issues/1 for API 1.0.0 compatibility)
- https://web.pulsar-edit.dev/packages/rsense (see: https://github.com/rsense/atom-rsense/issues/1 for API 1.0.0 compatibility)

## Deprecated Providers

If you are using one of these providers, please uninstall the package as it is no longer maintained.

- https://github.com/vito/atom-autocomplete-gocode (deprecated, use [go-plus](https://web.pulsar-edit.dev/packages/go-plus) instead)
- https://github.com/tinloaf/autocomplete-plus-python-jedi (deprecated, use [autocomplete-python](https://web.pulsar-edit.dev/packages/autocomplete-python) instead)

## Other Forks Of Autocomplete

- https://github.com/xumingthepoet/autocomplete-plus-elixir (never published)
- https://web.pulsar-edit.dev/packages/autocomplete-jedi (fork of `autocomplete`)
- https://web.pulsar-edit.dev/packages/rubymotion (extends default autocomplete package)
