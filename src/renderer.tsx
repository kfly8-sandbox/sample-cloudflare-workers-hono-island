import { reactRenderer } from '@hono/react-renderer'

export const renderer = reactRenderer(({ children }) => {
  return (
    <html>
      <head>
        <link href="/static/style.css" rel="stylesheet" />
        <script type="module" src="/static/client.js"></script>
      </head>
      <body>
        <div id="app">{children}</div>
      </body>
    </html>
  )
})
