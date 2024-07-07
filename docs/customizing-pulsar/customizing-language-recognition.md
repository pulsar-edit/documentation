---
title: Customizing language recognition
layout: doc.ejs
---

If you want Pulsar to always recognize certain file types as a specific grammar, you'll need to manually edit your `config.cson` file. You can open it using the **Application: Open Your Config** command from the Command Palette. For example, if you wanted to add the `foo` extension to the CoffeeScript language, you could add this to your configuration file under the `*.core` section:

```coffee
'*':
  core:
    customFileTypes:
      'source.coffee': [
        'foo'
      ]
```

In the example above, `source.coffee` is the language's scope name (see [Finding a language’s scope name](/customizing-pulsar/language-specific-configuration-settings/#finding-a-language%E2%80%99s-scope-name) for more information) and `foo` is the file extension to match without the period. Adding a period to the beginning of either of these will not work.
