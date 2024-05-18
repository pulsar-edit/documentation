---
title: Checking your build tools
layout: doc.ejs
---

If you are having issues installing a package using `pulsar -p install`, this could be because the package has dependencies on libraries that contain native code. This means you will need to have a C++ compiler and Python installed to be able to install it. You can run `pulsar -p install --check` to see if the Pulsar package manager can build native code on your machine.

Check out the pre-requisites in the [build instructions](/getting-started/dependencies-for-some-community-packages/) for your platform for more details.
