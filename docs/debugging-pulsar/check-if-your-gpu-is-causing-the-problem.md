---
title: Check if your GPU is causing the problem
layout: doc.ejs
---

If you encounter flickering or other rendering issues, you can stop Pulsar from
using your Graphics Processing Unit (GPU) with the `--disable-gpu` Chromium flag
to see if the fault lies with your GPU:

```sh
$ pulsar --disable-gpu
```

Chromium (and thus Pulsar) normally uses the GPU to accelerate drawing parts of
the interface. `--disable-gpu` tells Pulsar to not even attempt to do this, and
just use the CPU for rendering everything. This means that the parts of the
interface that would normally be accelerated using the GPU will instead take
slightly longer and render on the CPU. This likely won't make a noticeable
difference, but does slightly increase the battery usage on portable devices as
the CPU has to work harder to do the things the GPU is optimized for.

Two other Chromium flags that are useful for debugging are
`--enable-gpu-rasterization` and `--force-gpu-rasterization`:

```sh
$ pulsar --enable-gpu-rasterization --force-gpu-rasterization
```

`--enable-gpu-rasterization` allows other commands to determine how a layer tile
(graphics) should be drawn and `--force-gpu-rasterization` determines that the
Skia GPU backend should be used for drawing layer tiles (only valid with GPU
accelerated compositing).

Be sure to use Chromium flags at the end of the terminal call if you want to use
other Pulsar flags as they will not be executed after the Chromium flags e.g.:

```sh
$ pulsar --safe --enable-gpu-rasterization --force-gpu-rasterization
```
