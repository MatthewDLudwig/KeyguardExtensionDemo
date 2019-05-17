# KeyguardExtensionDemo

The code within this repository shows how the Nimiq Keyguard can be used in an extension.

The biggest restriction on the use of Keyguard in extensions is that popups must be used as Top Level Redirects require a referrer to be set.

To try the extension out yourself, fork it and install as an unpackaged extension (requires turning on Developer Mode in the Extension manager page).

It's recommended to use a Service Worker to cache any files from cdn.nimiq.com to improve popup loading times.
