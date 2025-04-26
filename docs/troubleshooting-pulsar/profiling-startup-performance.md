---
title: Profiling startup performance
layout: doc.ejs
---

If the time for loading the window looks high, you can create a CPU profile for that period using the `--profile-startup` command line flag when starting Pulsar:

```sh
$ pulsar --profile-startup .
```

This will automatically capture a CPU profile as Pulsar is loading and open the developer tools once Pulsar loads. From there:

1. Click the Profiles tab in the Developer Tools
2. Select the “startup” profile
3. Click the “Save” toolbar button for the startup profile

You can then include the startup profile in any issue you report.
