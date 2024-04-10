---
title: Diagnose runtime performance
layout: doc.ejs
---

If you're experiencing performance problems in a particular situation, your [issue reports](https://github.com/pulsar-edit/.github/blob/main/CONTRIBUTING.md#reporting-bugs) will be more valuable if you include a saved profile from Chrome’s CPU profiler that gives some insight into what is slow.

To run a profile, open the Developer Tools with <kbd class="platform-linux platform-win">Ctrl+Shift+I</kbd><kbd class="platform-mac">Alt+Cmd+I</kbd>. From there:

1. Click the _Profiles_ tab
2. Select "Collect JavaScript CPU Profile"
3. Click "Start"

![DevTools Profiler](/img/atom/cpu-profile-start.png)

Once that is done, then perform the slow action to capture a recording. When
finished, click "Stop". Switch to the "Chart" view, and a graph of the recorded
actions will appear. You can save and post the profile data by clicking "Save"
next to the profile's name in the left panel.

![DevTools Profiler](/img/atom/cpu-profile-done.png)

To learn more, check out the [Chrome documentation on CPU profiling](https://developer.chrome.com/devtools/docs/cpu-profiling).
