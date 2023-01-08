# Local development

Define a host mwnext.inciclopedia.es pointing to localhost (we enabled CORS for it)

If you need to login you will have to use Firefox and disable same site policy:

```aboutconfig
network.cookie.samesite.laxByDefault=false
network.cookie.samesite.noneRequiresSecure=false
```

Chrome no longer works for local dev as the same site policy prevents us from accepting the cookies without SSL.

Install dependencies

```bash
npm install
```

Start the server with

```bash
npm run dev
```