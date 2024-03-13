# pulsar-api/generate

This directory contains the code necessary to produce the newest Pulsar API JSON doc objects.

We will first check the `latest.json` file to see if the version there superseedes Pulsar's `package.json`.

If it does we then generate a new doc object, saving it under the version name to `./content`.

Finally updating the version in the `latest.json` file.

At this point the next build of the website will suppliment it's information with this newest version.
