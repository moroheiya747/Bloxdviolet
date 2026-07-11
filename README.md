# Bloxdviolet

Bloxdviolet is a Bloxd.io dedicated web proxy built on Ultraviolet.

It launches straight into Bloxd.io, keeps the proxy focused on Bloxd.io and the
external services the game depends on, and keeps the rest of the original
Ultraviolet plumbing intact.

## What this build does

- Opens Bloxd.io automatically from the launcher page.
- Proxies Bloxd.io and the external SDK / auth / CDN hosts the game uses.
- Blocks navigation to unrelated hosts so the proxy stays dedicated.

## Run it locally

```sh
npm install
npm run start
```

`npm run start` builds the launcher, starts a local web server, and opens the
Bloxd.io launcher at the root page. The launcher registers the service worker
and redirects into the proxied Bloxd.io session.

## Included files

- `dist/index.html` launches the proxy.
- `dist/sw.js` registers the Ultraviolet service worker.
- `dist/uv.*` contains the proxy runtime and configuration.

## Notes

- This repository assumes you have permission to proxy Bloxd.io.
- The default start page is `https://bloxd.io/`.
- The proxy is tuned for Bloxd.io gameplay, login-related dependencies, and the
  related third-party services referenced by the site.
