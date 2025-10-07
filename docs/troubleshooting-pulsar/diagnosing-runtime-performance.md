---
title: Diagnosing runtime performance
layout: doc.ejs
---

If you’re experiencing performance problems in a particular situation, your [issue reports](https://github.com/pulsar-edit/.github/blob/main/CONTRIBUTING.md#reporting-bugs) will be more valuable if you include a saved profile from Chrome’s CPU profiler that gives some insight into what is slow.

To run a profile, open the Developer Tools with <kbd class="platform-linux platform-win">Ctrl+Shift+I</kbd><kbd class="platform-mac">Alt+Cmd+I</kbd>. From there:

1. Click the _Profiles_ tab
2. Click the “Record” button in the toolbar (see screenshot below)

![DevTools Profiler](/img/atom/profile-record.png)

Once the profile starts collecting data, perform the slow action to capture it in the performance profile. When finished, click “Stop.” After some processing, a graph of the recorded actions will appear. You can save and post the profile data by clicking the ”Save” icon in the toolbar.

![DevTools Profiler](/img/atom/profile-save.png)

To learn more, check out the [Chrome documentation on the Performance tab](https://developer.chrome.com/docs/devtools/performance/overview).
