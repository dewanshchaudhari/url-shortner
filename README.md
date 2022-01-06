# 🌐 `Url-Shortner-Cloudflare-Workers`

A Cloudflare worker project to build url shortening app.

## How to use

Send a POST request to [https://url-shortner.codewansh.workers.dev](https://url-shortner.codewansh.workers.dev)
with payload as
`{ url:https://example.com/, (required) slug:abcxyz, (key for redirection,optional) len:6, (length of key to be generated if slug is not specified,optional) }`
