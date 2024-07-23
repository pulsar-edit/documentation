---
title: Creating a grammar (modern Tree-sitter)
layout: doc.ejs
---

Pulsar's modern syntax highlighting and code folding system is powered by [Tree-sitter](http://tree-sitter.github.io/tree-sitter). Tree-sitter parsers create and maintain full [syntax trees](https://en.wikipedia.org/wiki/Abstract_syntax_tree) representing your code.

Modeling the buffer as a syntax tree gives Pulsar a comprehensive understanding of the structure of your code, which has several benefits:

1. Syntax highlighting will not break because of formatting changes.
2. Code folding will work regardless of how your code is indented.
3. Editor features can operate on the syntax tree. For instance, the **Select Larger Syntax Node** and **Select Smaller Syntax Node** commands allow you to select conceptually larger and smaller chunks of your code.
4. Community packages can use the syntax tree to understand and manipulate code more intelligently.

## Getting started

There are three components required to use Tree-sitter in Pulsar: a parser, a grammar file, and a handful of query files.

## The parser

Tree-sitter generates parsers based on [context-free grammars](https://en.wikipedia.org/wiki/Context-free_grammar) that are typically written in JavaScript. The generated parsers are C libraries that can be used in other applications as well as Pulsar.

They can also be developed and tested on the command line, separately from Pulsar. Tree-sitter has [its own documentation page](http://tree-sitter.github.io/tree-sitter/creating-parsers) on how to create these parsers. The [Tree-sitter GitHub organization](https://github.com/tree-sitter) also contains a lot of example parsers that you can learn from, each in its own repository.

Pulsar uses `web-tree-sitter` — the WebAssembly bindings to tree-sitter. That means that you’ll have to build a WASM file for your parser before it can be used.

:::warning Tree-sitter versions are important
Currently, Pulsar builds its own custom copy of `web-tree-sitter` for reasons explained [in this README](https://github.com/pulsar-edit/pulsar/tree/master/vendor/web-tree-sitter). In the future, to know which version of `web-tree-sitter` Pulsar is using, please visit that folder on GitHub and read the commit message of the commit that most recently touched `tree-sitter.js`.

At time of writing this document, it was 0.20.9, which would mean you’d be able to use a version of Tree-sitter **no newer than** 0.20.9 when generating your WASM file. (Older versions are generally OK; Tree-sitter preserves backwards-compatibility of parsers generated with older versions.)

Building WASM files from the `tree-sitter` CLI requires either a local installation of [Emscripten](https://emscripten.org/) or use of a Docker image. See [this reference](https://github.com/sogaiu/ts-questions/blob/master/questions/which-version-of-emscripten-should-be-used-for-the-playground/README.md) for details.

:::

If you want to use an existing parser, you’ll probably be able to find it on [NPM](https://npmjs.com/). If you’ve written your own parser, it’s a good idea to publish it to NPM yourself. Either way, you should install it as a `devDependency` for your `language-*` package.

You can then go into the directory for your parser and use [the Tree-sitter CLI](https://github.com/tree-sitter/tree-sitter-cli) to build the WASM file:

```
cd node_modules/tree-sitter-foo
tree-sitter build-wasm .
```


## The package

Once you have a WASM file, you can use it in your Pulsar package. Packages with grammars are, by convention, always named starting with `language-`. You'll need a folder with a `package.json`, a `grammars` subdirectory, and a single JSON or CSON file in the `grammars` directory, which can be named anything.

We’ve also decided to put our WASM file in the `grammars/tree-sitter` subdirectory, though this is just a convention. The SCM files alongside our WASM file will be explained in a moment.

```
language-mylanguage
├── LICENSE
├── README.md
├── grammars
│   ├── mylanguage.cson
│   └── tree-sitter
│       ├── grammar.wasm
|       ├── folds.scm
|       ├── highlights.scm
|       ├── indents.scm
|       └── tags.scm
└── package.json
```

##  The grammar file

The `mylanguage.cson` file specifies how Pulsar should use the parser you created.

### Basic fields

It starts with some required fields:

```coffeescript
name: 'My Language'
scopeName: 'source.mylanguage'
type: 'modern-tree-sitter'
parser: 'tree-sitter-mylanguage'
```

* `scopeName` - A unique, stable identifier for the language. Pulsar users will use this identifier in configuration files if they want to specify custom configuration based on the language. Examples: `source.js`, `text.html.basic`.
* `name` - A human readable name for the language.
* `parser` - The name of the parser node module that will be used for parsing. This should point to the NPM package from which the WASM file was built. (This value is currently unused, but is required as a way of future-proofing in case Pulsar should migrate to a different Tree-sitter binding in the future.)
* `type` - This should have the value `modern-tree-sitter` to indicate to Pulsar that this is a modern Tree-sitter grammar, as opposed to a legacy Tree-sitter grammar (soon to be removed from Pulsar) or a [TextMate grammar](https://pulsar-edit.dev/docs/launch-manual/sections/core-hacking/#creating-a-legacy-textmate-grammar).

### Tree-sitter fields

The `treeSitter` configuration key holds the fields that specify the paths on disk to the grammar and its query files:

```coffeescript
treeSitter:
  grammar: 'tree-sitter/grammar.wasm'
  highlightsQuery: 'tree-sitter/highlights.scm'
  foldsQuery: 'tree-sitter/folds.scm'
  indentsQuery: 'tree-sitter/indents.scm'
```

All values are paths that will be resolved relative to the grammar configuration file itself. Of these, `grammar` is the only required field.

* `grammar` — The path to the WASM file you generated earlier.
* `highlightsQuery` — The path to a file (canonically called `highlights.scm`) that will tell Pulsar how to highlight the code in this language. (Most Tree-sitter repositories include a `highlights.scm` file that can be useful to consult, but _should not_ be used in Pulsar, because its naming conventions are different from Pulsar’s.)
* `foldsQuery` — The path to a file (canonically called `folds.scm`) that will tell Pulsar which ranges of a buffer can be folded.
* `indentsQuery` — The path to a file (canonically called `indents.scm`) that will tell Pulsar when it should indent or dedent lines of code in this language.
* `tagsQuery` — The path to a file (canonically called `tags.scm`) that will identify the important symbols in the document (class names, function names, and so on) along with their locations. If present, Pulsar will use this query file for symbol navigation. (Most Tree-sitter repositories include a `tags.scm` file that _can be understood as-is_ by Pulsar and is a good starting point.)

You can skip `indentsQuery` if your language doesn’t need indentation hinting, `foldsQuery` if it doesn’t need code folding, or even `highlightsQuery` in the unlikely event that your language does not need syntax highlighting.

Any of the settings that end in `Query` can also accept an array of relative paths, instead of just a single path. At initialization time, the grammar will concatenate each file’s contents into a single query file. This isn’t a common need, but is explained further below.

### Language recognition

Next, the file should contain some fields that indicate to Pulsar when this language should be chosen for a given file. These fields are all optional and are listed in the order that Pulsar consults them when making its decision.

* `fileTypes` - An array of filename suffixes. The grammar will be used for files whose names end with one of these suffixes. Note that the suffix may be an entire filename, like `Makefile` or `.eslintrc`. If no grammars match (or more than one grammar matches) for a given file extension, ties are broken according to…  
* `firstLineRegex` - A regex pattern that will be tested against the first line of the file. The grammar will be used if this regex matches. If no grammars match (or more than one grammar matches) for a given `firstLineRegex`, ties are broken according to…
* `contentRegex` - A regex pattern that will be tested against the contents of the file. If the `contentRegex` matches, this grammar will be preferred over another grammar with no `contentRegex`. If the `contentRegex` does not match, a grammar with no `contentRegex` will be preferred over this one.

### Comments

The last field in the grammar file, `comments`, controls the behavior of Pulsar's **Editor: Toggle Line Comments** command. Its value is an object with values as follows:

* `start`: The delimiter that should be added to the beginning of a line to mark a comment. If your language supports line comments, specify the line comment delimiter here and skip the `end` value. This value will be used by the **Editor: Toggle Line Comments** command.
* `end`: The delimiter that should be added to the end of a line to mark a comment. Specify `end` _only_ if your language supports only block comments (for example, CSS). If present, this value will be used by the **Editor: Toggle Line Comments** command.
* `line`: The delimiter that marks a line comment. Regardless of what is defined in `start` or `end`, `line` refers to the line comment delimiter. If your language doesn’t support line comments, omit this field. This value is used by snippets that want to insert comment delimiters in a language-agnostic fashion.
* `block`: A two item array containing the starting and ending delimiters of a block comment. If your language doesn’t support block comments, omit this field. These values are used by snippets that one to insert comment delimiters in a language-agnostic fashion.

JavaScript has both line and block comments, so the `comments` field might look like this:

```coffeescript
comments:
  start: '// '
  block: ['/*', '*/']
  line: '//'
```

CSS has only block comments, so it’d look like this:

```coffeescript
comments:
  start: '/* '
  end: ' */'
  block: ['/*', '*/']
```

And Python has only line comments, so it’d look like this:

```coffeescript
comments:
  start: '# ',
  line: '#'
```

:::tip

When present, Pulsar prefers for these values to be specified in CSON files in the `settings` directory of your package. That approach has the advantage of allowing you to customize comment delimiters according to the surroundings of the file.

If this isn’t something your language needs — and most don’t — then you can ignore this tip. But it’s occasionally crucial. For instance, comment syntax within JSX blocks (used in React and other framewokrs) is different from ordinary JavaScript comment syntax. [The settings file for `language-javascript`](https://github.com/pulsar-edit/pulsar/blob/master/packages/language-javascript/settings/language-javascript.cson) may help illustrate.

:::

## Syntax highlighting

The HTML classes that Pulsar uses for syntax highlighting do not correspond directly to nodes in the syntax tree. Instead, Pulsar queries the tree using a file called `highlights.scm` and written using Tree-sitter’s own [query language](https://tree-sitter.github.io/tree-sitter/using-parsers#pattern-matching-with-queries).

Here is a simple example:

```scm
(call_expression
  (identifier) @support.other.function)
```

This entry means that, in the syntax tree, any `identifier` node whose parent is a `call_expression` should be given the scope name `support.other.function`. In the editor, such an identifier will be wrapped in a `span` tag with three classes applied to it: `syntax--support`, `syntax--other`, and `syntax--function`. Syntax themes can hook into these class names to [style source code](../developing-a-theme) via CSS or LESS files.

Some queries will be quite easy to express, but some others will be highly contextual. Consult some built-in grammars’ `highlights.scm` files for examples.

### Scope tests: advanced querying

Tree-sitter supports additional matching criteria for queries called _predicates_. For instance, here’s how we can distinguish a block comment from a line comment in JavaScript:

```scm
((comment) @comment.block.js
  (#match? @comment.block.js "^/\\*"))

((comment) @comment.line.js
  (#match? @comment.line.js "^//"))
```

We’re using the built-in `#match?` predicate, along with a regular expression, to search the text within the `comment` node. Our regexes are anchored to the beginning of the string and test whether the opening delimiter signifies a block comment (`/* like this */`) or a line comment (`// like this`). In the block comment’s case, we don’t have to attempt to match the ending (`*/`) delimiter — we _know_ it must be present, or else the Tree-sitter parser wouldn’t have classified it as a `comment` node in the first place.

Unfortunately, there aren’t many built-in predicates in `web-tree-sitter` alongside `#match?` and `#eq?` (which tests for _exact_ equality). But the ones that are present — `#set!`, `#is?`, and `#is-not?` — allow us to associate arbitrary key/value pairs with a specific capture. Pulsar uses these to define its own _custom_ predicates.

For instance, you may want to highlight things differently based on their position among siblings:

```scm
(string
  "\"" @punctuation.definition.string.begin.js
  (#is? test.first))
(string
  "\"" @punctuation.definition.string.end.js
  (#is? test.last))
```

In most Tree-sitter languages, a `string` node’s first child will be its opening delimiter, and its last child will be its closing delimiter. To add two different scopes to these quotation marks, we can use the `test.first` and `test.last` custom predicates to distinguish these two nodes from one another.


### Prioritizing scopes

It’s common to want to add one scope to something if it passes a certain test, but a different scope if it fails the test.

```scm
; Scope this like a built-in function if we recognize the name…
(call_expression (identifier) @support.function.builtin.js
  (#match? @support.function.builtin.js "^(isFinite|isNaN|parseFloat|parseInt)$"))

; …or as a user-defined function if we don't.
(call_expression (identifier) @support.other.function.js)
```

This doesn’t do what you might expect because a given buffer range can have any number of scopes applied to it. That means the "parseFloat" in `parseFloat(foo)` will be given _both_ of these scope names, since it matches both of these captures.

How can we get around this? One option is the `#not-match?` predicate — the negation of `#match?` — to ensure that anything which passes the first test will fail the second, and vice versa:

```scm
; Scope this like a built-in function if we recognize the name…
(call_expression (identifier) @support.function.builtin.js
  (#match? @support.function.builtin.js "^(isFinite|isNaN|parseFloat|parseInt)$"))

; …or as a user-defined function if we don't.
(call_expression (identifier) @support.other.function.js
  (#not-match? @support.function.builtin.js "^(isFinite|isNaN|parseFloat|parseInt)$"))
```

This is a fine solution for our oversimplified example, but would get pretty complicated if there were more than one fallback.

Another approach is to use Pulsar’s custom predicates called `capture.final` and `capture.shy`. For instance, we could use `capture.final` on the first capture to “claim” it:

```scm
; Scope this like a built-in function if we recognize the name…
(call_expression (identifier) @support.function.builtin.js
  (#match? @support.function.builtin.js "^(isFinite|isNaN|parseFloat|parseInt)$")
  (#set! capture.final))

; …or as a user-defined function if we don't.
(call_expression (identifier) @support.other.function.js)
```

The `capture.final` predicate means that the first capture will apply its own scope name, then _prevent_ all further attempts to add a scope to the same buffer range. This works because two different captures for the same node will be processed in the order in which their queries are defined in the SCM file — so if a token were to match both of these captures, it’s guaranteed that the first capture would be processed before the second.

Another option would be to use `capture.shy` on the second capture:

```scm
; Scope this like a built-in function if we recognize the name…
(call_expression (identifier) @support.function.builtin.js
  (#match? @support.function.builtin.js "^(isFinite|isNaN|parseFloat|parseInt)$"))

; …or as a user-defined function if we don't.
(call_expression (identifier) @support.other.function.js
  (#set! capture.shy))
```

The `capture.shy` predicate creates a true fallback option; it only applies its scope if _no_ other scope — not just one that uses `capture.final` — has previously been applied for the same buffer range. But it doesn’t “lock down” its buffer range the way that `capture.final` does, so a later capture could add another scope to the same range.

There’s one caveat to mention. Consider this query:

```scm
(call_expression (identifier) @support.other.function.js @meta.something-else.js
  (#set! capture.final))
```

This is a valid Tree-sitter query; you can assign up to three capture names at once. But the outcome might be surprising: `support.other.function.js` will be applied, and `meta.something-else.js` will not. This happens because these two capture names aren’t processed simultaneously; they’re processed in sequence. So the `capture.final` predicate will act after the first capture name and prevent the second from being applied.

Here’s one way to rewrite this to have the intended effect:

```scm
; Apply each capture in its own query…
(call_expression (identifier) @support.other.function.js)

; …and use capture.final only on the second capture name.
(call_expression (identifier) @meta.something-else.js
  (#set! capture.final true))

```

### Other scope tests

Pulsar defines many custom predicates, otherwise known as **scope tests**, to help grammar authors define accurate syntax highlighting. All scope tests are prefaced with `test.` in `#is?` and `#is-not?` predicates.

You’ve already seen an example with `test.first` and `test.last`. Other examples include:

* `test.firstOfType` and `test.lastOfType`, for matching only the first or last node of a certain type among siblings
* `test.ancestorOfType` and `test.descendantOfType`, for testing whether a node contains, or is contained by, a node of a certain type
* `test.config`, for capturing certain nodes conditionally based on the user’s configuration

Some tests take a single argument…

```scm
((identifier) @foo
  (#is? test.descendantOfType "function"))
```

…but any test that doesn’t requre an argument can be expressed without one.

```scm
((identifier) @foo
  (#is? test.lastOfType))
```

Consult the [`ScopeResolver` API documentation](TODO) for a full list.

### Scope adjustments: tweaking buffer ranges

There may be times when the range you want to highlight doesn’t correspond exactly with the range of a single node in the syntax tree. For those situations, you can use **scope adjustments** to tweak the range:

```scm
; Scope the `//` in a line comment as punctuation.
((comment) @punctuation.definition.comment.js
  (#match? @punctuation.definition.comment.js "^//")
  (#set! adjust.startAndEndAroundFirstMatchOf "^//"))
```

Some adjustments move the boundaries of the scope based on pattern matches inside a node’s text, like in the example above. Others may move the boundaries based on a _node position descriptor_ — a string like `lastChild.startPosition` that points to a specific position in a tree relative to another node — so they can wrap a single scope around two or three adjacent sibling nodes.

There’s only one catch: **adjustments can only _narrow_ the range of a capture, not expand it**. That’s important because Pulsar depends on Tree-sitter to tell it when certain regions of the buffer are affected by edits and need to be re-highlighted. That system won’t work correctly if a capture that starts and ends on row 1 can stretch itself to add a scope to something on row 100.

Consult the [`ScopeResolver` API documentation](TODO) for a full list.

### Sharing query files

You may find it appropriate for two different grammars to share a query file. This can work when one Tree-sitter parser builds upon the work of another; for instance, the `tree-sitter-tsx` parser is basically the `tree-sitter-typescript` parser with JSX additions, so it makes sense for the two grammars to share most of their query files.

For this reason, each of the fields that ends in `Query` in a grammar definition file can accept an array of paths instead of a single path. Consider a hypothetical grammar for TypeScript-plus-JSX:

```coffeescript
treeSitter:
  grammar: 'tree-sitter-tsx/grammar.wasm'
  languageSegment: 'ts.tsx'
  highlightsQuery: [
    'highlights-common.scm'
    'tree-sitter-tsx/highlights.scm'
  ]
  foldsQuery: 'tree-sitter-tsx/folds.scm'
  indentsQuery: 'tree-sitter-tsx/indents.scm'
```

The highlights query loads two different files: one that is common to `tree-sitter-typescript` and `tree-sitter-tsx`, and one that is unique to `tree-sitter-tsx`. The latter file would contain queries that deal with JSX and anything else that would not be understood by `tree-sitter-typescript`.

You might also notice a new key: `languageSegment`. This optional property allows one to write a shared query file generically…

```scm
(class_declaration
  name: (type_identifier) @entity.name.type.class._LANG_)
```

…while retaining the ability to add a grammar-specific scope segment at the end of a capture. At initialization time, all `_LANG_` segments in this SCM file would be dynamically replaced with `ts.tsx`, and the capture name above would become `@entity.name.type.class.ts.tsx`. In the ordinary TypeScript grammar, specifying a `languageSegment` of `ts` would allow that grammar to define a capture name of `@entity.name.type.class.ts`.


## Language injection

Often, a source file will contain code written in several different languages. An HTML file, for instance, may need to highlight JavaScript (if the file has an inline `script` element) or CSS (if the file has an inline `style` element).

Tree-sitter grammars support this situation using a two-part process called _language injection_. First, an “outer” language must define an injection point - a set of syntax nodes whose text can be parsed using a different language, along with some logic for guessing the name of the other language that should be used. Second, an “inner” language must define an `injectionRegex` - a regex pattern that will be tested against the language name provided by the injection point.

The inner language can, in turn, define any injection points _it_ may need, such that different grammars can be “nested” inside of a buffer to an arbitrary depth.

The code to define language injections should be placed inside of `lib/main.js` within your `language-` package. That file should export a function called `activate` that defines the injection points:

```js
exports.activate = () => {
  atom.grammars.addInjectionPoint(/* … */);
};
```

Be sure to include a `main` field in the package’s `package.json` that points to this file:

```json
"main": "lib/main"
```

### Using `addInjectionPoint`

In JavaScript, [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_templates) sometimes contain code written in a different language, and the tag’s name tends to hint at the language being used inside the template string:

```js
// HTML in a template literal
const htmlContent = html`<div>Hello, ${name}</div>`;

// CSS in a template literal
const styles = styled.a`
  border: 2px solid #000;
  color: #fff;
`
```

The `tree-sitter-javascript` parser parses the first tagged template literal as a `call_expression` with two children: an `identifier` and a `template_literal`:

```scm
(call_expression
  function: (identifier)
  arguments: (template_string
    (template_substitution
      (identifier))))
```

So here’s how we might allow syntax highlighting inside of template literals:

```js
atom.grammars.addInjectionPoint("source.js", {
  type: "call_expression",

  language(callExpression) {
    const { firstChild, lastChild } = callExpression;
    if (firstChild?.type === "identifier" && lastChild?.type === "template_string") {
      return firstChild.text;
    }
  },

  content(callExpression) {
    return callExpression?.lastChild;
  }
});
```

So what happens when we use an `html` tagged template literal, as in the first example above?

1. Every `call_expression` node in the tree would be assessed as a possible candidate for injection.

2. Each of those nodes would be passed into our `language` callback to see if it can be matched to an injection language. In our example, first we’d inspect the tree to make sure this is a tagged template literal; then we’d return the text of the `identifier` node — `html` in this example. If that string can be matched with a known grammar, the injection can proceed.

3. The `content` callback would then be called with the same `call_expression` node and return the last child of the `call_expression` node — which we’ve already proven is of the type `template_string` — since that node precisely describes the content that should be parsed as HTML. That node exists in our example, so the injection can proceed.

We skipped something important in step 2: _how_ do we turn the string `html` into the HTML grammar? The HTML grammar file would need to specify an `injectionRegex`, so that the string `html` returned from the `language` callback can match itself to the right grammar:

```coffeescript
injectionRegex: 'html|HTML'
```

If more than one grammar’s `injectionRegex` matches the string in question, Pulsar will pick the grammar whose `injectionRegex` produced the longest string match.

When defining your own `injectionRegex`, consider how specific you want your pattern to be. In our example, it’s a safe bet that any template literal tag or heredoc string delimiter that even _contains_ the string `HTML` is describing content that should be highlighted like HTML. But a language like C, for example, might want to define a much more restrictive pattern that won’t get matched for an identifier like `coffeescript` or `c-sharp`:

```coffeescript
injectionRegex: '^(c|C)$'
```

The `injectionRegex` property is only required for grammars that expect to be injected into other grammars. If this doesn’t apply to your grammar, you can omit `injectionRegex` altogether.


### Advanced injection scenarios

Each individual injection point understands that it might have to operate on disjoint ranges of the buffer, ignoring certain ranges of content in between. Let’s look at our example code again:

```js
// HTML in a template literal
const htmlContent = html`<div>Hello, ${name}</div>`;
```

Here, `${name}` is a JavaScript template string interpolation, and it has no special meaning in HTML. But an interpolation could include arbitrary JavaScript, including content that would flummox a parser designed to interpret HTML.

It’s for this reason that, by default, injection points ignore the _descendants_ of their content nodes. When an injection determines which ranges in the buffer it should parse, it takes the ranges described by its content nodes and _subtracts_ the ranges of their children, unless instructed otherwise. So our injection will cover the range of the `template_string` _minus_ the ranges of any interpolations (the `template_substitution` child nodes).

When the injection content is parsed, Tree-sitter will look at only the ranges Pulsar tells it to; anything outside those ranges will be invisible to the parser.

So our example above would look like this to the HTML grammar:

```html

                         <div>Hello,        </div>
```


Ignoring child nodes is the correct decision for scenarios like tagged template literals and heredoc strings, but it might not be the correct decision for other injections, so this behavior is configurable.

Here are some other things you can do with injections, if needed:

* block the parent grammar from highlighting anything in the injection’s content ranges
* include the injected language’s base scope name (`text.html.basic` in our case), include a different base scope name instead, or omit it altogether
* consolidate ranges that are separated only by whitespace
* include newline characters when they appear between disjoint content ranges so that the injection’s parser doesn’t think those ranges are part of the same line

For more information on these features, read the API documentation for {GrammarRegistry::addInjectionPoint}.

## Code folding

[Code folding](/core-packages-and-features/folding/) can only happen if the grammar helps Pulsar to understand which ranges of the buffer represent logical sections that can be collapsed. A Tree-sitter grammar does this via `folds.scm` — a query file whose only purpose is to mark “foldable” sections of the buffer.

### Simple folds

The complexity of a `folds.scm` will vary based on the language. At its simplest, it will look like the following:

```scm
(block) @fold
```

Believe it or not, that’s the _entire contents_ of the `folds.scm` file inside the `language-css` package. Because CSS’s syntax is very regular, the `block` node can handle all situations where content is enclosed in a pair of curly braces.

The `@fold` capture is called a **simple fold**. It’s the easiest kind of fold to describe because Tree-sitter has done most of the work simply by identifying the regions to be folded. By default, here’s how Pulsar turns that capture into a foldable range:

1. It will inspect the `block` node to find out the buffer rows it starts and ends on. If the `block` node starts on row `X`, the fold will begin at the very end of row `X`.
2. It assumes the very last child of `block` is its closing delimiter (because that’s usually true) and sets the ending boundary of the fold to be just _before_ that closing delimiter, so that both the opening and closing delimiters are visible when the range is folded.
3. If the two ends of the fold are on different rows, the fold is valid, and will be indicated by a chevron in the gutter of row `X`. If the would-be fold range starts and ends on the _same_ row, the fold is invalid and therefore ignored.

Sometimes simple folds need tweaking — for instance, in the case of a multi-line `if/else-if/else` construction. And in some languages, like Python, there _aren’t_ any ending delimiters, so this logic won’t work out of the box.

That’s why Pulsar lets you customize the ends of simple folds — for instance, by specifying a _different_ ending position in the tree relative to the starting node. Or by altering a position an arbitrary amount — nudging it a few characters in either direction, or moving it to the end of the previous line.

Consult the API documentation for more information.

### Divided folds

There’s a different kind of fold, called a _divided fold_, that can be used when simple folds aren’t an option. They use the capture names `@fold.start` and `@fold.end` to specify the boundaries of the fold in two separate captures.

Divided folds are needed when the region to be folded isn’t represented by a single node, or by some predictable path from one node to another. Examples include preprocessor definitions in C/C++ files and sections inside Markdown files.

But the best example might be complex conditionals in shell scripts. In most other built-in Tree-sitter grammars, these conditionals can be handled with simple folds. But shell scripts are a bit “messy,” and the parsed tree reflects that:

```scm
(if_statement "then" @fold.start)
(elif_clause) @fold.end
(elif_clause "then" @fold.start)
(else_clause) @fold.end @fold.start
"fi" @fold.end
```

A `@fold.start` capture on a node means that a fold will start at the end of that node’s starting row. A `@fold.end` capture on a node means that a fold will end at the end of the row **before** that node’s starting row.

This behavior allows a given node to be captured with _both_ `@fold.start` _and_ `@fold.end`, as in the case of the `else_clause` above. If we see an `else` on row 10, it means that one fold has ended at the end of row 9, and another one will begin at the end of row 10.

Divided folds need to pair up, and Pulsar pairs them up by starting with a `@fold.start` capture and looking for a _balanced_ occurrence of `@fold.end`, keeping in mind that folds can be nested inside other folds.

There are good reasons to prefer simple folds wherever possible, and to use divided folds only when there isn’t another option. For one thing, it becomes the grammar author’s responsibility to ensure that `@fold.start` and `@fold.end` are captured in equal numbers, and that each `@fold.start` matches up with its intended `@fold.end`.

You can read more about folds in the API documentation.

## Indents

The third sort of query file is typically called `indents.scm`, and its purpose is to identify items in the tree that hint at indents or dedents.

To oversimplify, here’s how indentation typically works in Pulsar, regardless of which sort of grammar is used:

* If the user is typing on row 9, then presses <kbd>Enter</kbd>, we’ll decide whether to indent row 10 based on what’s present on line 9. For example, if row 9 ends with an opening curly brace (`{`), that’s a clear sign that row 10 should start with the cursor one level deeper than row 9. Therefore: **to decide whether to _indent_ a row, we usually examine the row above it.**

* When the user starts typing on row 10, we might decide that row 10 shouldn’t be indented after all. For instance, if the first character the user typed is a closing curly brace (`}`), then Pulsar will immediately decrease the indent level of that line by one level. Therefore: **to decide whether to _dedent_ a row, we usually examine the content of the row itself.**

In TextMate grammars, the decisions to indent and dedent are made by comparing the contents of lines to regular expressions. In Tree-sitter grammars, the decisions are made by through query captures — typically captures named `@indent` and `@dedent`.

This is a good starting point for an `indents.scm` for a C-like language:

```scm
["{" "[" "("] @indent
["}" "]" ")"] @dedent
```

The fact that Tree-sitter grammars expose their delimiters in the tree as [anonymous nodes](http://tree-sitter.github.io/tree-sitter/using-parsers#named-vs-anonymous-nodes) makes it very easy to interpret indentation hints. You are encouraged to capture anonymous nodes in your `indents.scm` when possible — because (a) they’re usually the best signifiers of when indentation needs to happen, and (b) they tend to be present in a tree even when the tree is in an error state (like when the user is in the middle of typing a line).

Here’s how we’d use these queries to make indentation decisions:

* Starting with an empty JavaScript file, a user types `if (foo) {` and presses <kbd>Enter</kbd>. Pulsar runs an indent query on row 1, gets a match for `@indent`, and responds by increasing the indent level on the next line.
* The user types a placeholder comment like `// TODO implement later` and presses <kbd>Enter</kbd> again. A query runs against row 2, finds no matches, and therefore decides that row 3 should maintain row 2’s indentation level.
* Finally, the user types `}`. After that keystroke, Pulsar runs an indent query on row 3, finds that the row now starts with a `@dedent` capture, and responds by dedenting row 3 by one level immediately.

Thus you can see that `@indent` means “indent the next line,” while `@dedent` typically means “dedent the current line.” But keep this in mind as well:

* If the user had instead typed `if (foo) { /* TODO */ }` on row 1 and pressed <kbd>Enter</kbd>, we’d need to be smart enough to know that the `{` that signals an indent was “cancelled out” by the `}` that came after it. That’s the second purpose of `@dedent`: to balance out `@indent` captures when deciding whether to indent the next line.
* A `@dedent` capture typically results in a dedent _only_ when it’s the first non-whitespace content on the row. And if the row to be dedented is the one being typed on, Pulsar will trigger a dedent _exactly once_, rather than after each character typed on the row.

  Why? Because if you don’t want the row to be dedented after all, this behavior allows you to re-indent the row the way you want and continue typing without Pulsar stubbornly trying to re-dedent the row over and over in a perverse game of tug-of-war.


Some other languages don’t have it so easy. Ruby, for instance, doesn’t open its logical blocks with one consistent delimiter…

```rb
if foo
  bar
end

while x < y
  x += 2
end
```

…which means that its `indents.scm` looks more complex.

```scm
[
  "class" "def" "module" "if" "elsif" "else" "unless" "case" "when" "while"
  "until" "for" "begin" "do" "rescue" "ensure" "(" "{" "["
] @indent

[
  "end" ")" "}" "]" "when" "elsif" "else" "rescue" "ensure"
] @dedent
```

### Advanced indents

Indent captures can use the same set of scope tests that were described earlier for syntax highlighting, because sometimes a node should only hint at an indent in certain situations.

For instance, we can handle “hanging” indents like this one…

```js
  return this.somewhatLongMethodName() ||
    this.somehowAnEvenLongerMethodName();
```

…because we understand that `||` can’t possibly terminate a JavaScript statement, so the next line must be a logical continuation of the statement.

```scm
(["||" "&&"] @indent
  (#is? test.lastTextOnRow))
```

`@indent` and `@dedent` are often the only captures you need. But for unusual situations, Pulsar allows for other sorts of captures:

* `@dedent.next` can be used for the situation where something in row `X` hints that row `X + 1` should be dedented _no matter what_ its content is.

  One example would be a conditional statement without braces…

  ```js
  if (!e.shiftKey)
    return e.preventDefault();
  ```

  …because the line immediately after this code should always be dedented one level from the `return` statement.

* `@match` is a powerful capture that can accept configuration. When a `@match` capture is present, it will set the indent level of the current row to equal the level of a specific earlier row. For instance, consider one way to indent a `switch` statement:

  ```js
  switch (job) {
    case 'lint':
      lintFile();
    case 'fix':
      fixFile();
    default:
      console.warn("Unknown job");
  }
  ```

  This indentation style means that the closing brace (`}`) should be dedented _two_ levels from the previous line. A `@match` capture can handle this as follows…

  ```scm
  ((switch_body "}" @match
    (#set! indent.matchIndentOf parent.startPosition)))
  ```

  …because this capture tells Pulsar to set the closing brace’s row to match the indent level of the row where the `switch_body` itself starts. Pulsar therefore sets row 8’s level to match row 1’s.

  `@match` captures can also define an offset — for scenarios where they want to indent themselves some number of levels _more_ or _less_ than a reference row.

Read the full indent query documentation to learn the details.

## Tags

The fourth sort of query file is typically called `tags.scm`, and its purpose is to identify “tags” or “symbols” — nodes in the tree that contain the names of important things.

:::info
Tree-sitter and other tools call these things “tags,” hence `tags.scm`; but Pulsar calls them “symbols” — hence the {symbols-view} package.
:::

Pulsar’s knowlege of symbols is what allows you to type <kbd class="platform-mac">Cmd+R</kbd> <kbd class="platform-win platform-linux">Ctrl+R</kbd> and navigate a source code file by function name, or a CSS file by selector, or a Markdown file by heading name.

The `tags.scm` file present in most Tree-sitter repositories goes into a level of detail far greater than what Pulsar needs, but that file will nonetheless work very well as-is, and can almost always be copied directly.

If your Tree-sitter parser does not include a `tags.scm`, or if you want to explore customization options, you can read the README for the built-in {symbol-provider-tree-sitter} package.
