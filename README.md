## What is this?

This project is a sample application to try these stack:

- [Hono](https://hono.dev)
- [React](https://react.dev/)
- [Cloudflare wrangler](https://developers.cloudflare.com/workers/wrangler/)
  - To dev server, deploy Cloudflare Workers
- [Vite](https://vite.dev/)
  - To build client codes.

This project is characterized by implementing the islands architecture.
For example, [shadcn/ui](https://www.shadcn.net/) components works.

## Setup

```txt
# Install deps
bun install

# Run dev server and watch codes
bun run dev

# Deploy to Cloudflare Workers (required Cloudflare settings)
bun run deploy
```

## Architectures

```
├── client.tsx  // Entrypoint of client side
├── components // components (that is installed by shadcn/ui)
│   └── ui
│       ├── button.tsx
│       └── checkbox.tsx
├── islands          // island components
│   ├── Counter.tsx
│   ├── Hello.tsx
│   └── MyForm.tsx
├── lib // utilities
│   ├── island.tsx
│   └── utils.ts
├── server.tsx // Entrypoint of server side
└── style.css  // Entrypoint of tailwind css
```

## How to add shadcn/ui components?

```
bunx --bun shadcn@latest add COMPONENT_NAME
```

Ref: https://www.shadcn.net
