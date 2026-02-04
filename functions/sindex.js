import dotenv from "dotenv"
dotenv.config()

import { promises as fs } from "fs"
import express from "express"
import { createServer } from "vite"
import serverless from "serverless-http";

const app = express()
const environment = process.env.VITE_ENVIRONMENT
const PORT = process.env.port || 5172

async function startServer() {
  const vite = await createServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom"
  })

  app.use(vite.middlewares)

  app.use('/.netlify/functions/server', app);  // path must route to lambda

  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    try {
      const template = await fs.readFile("/index.html", "utf-8")
      const metaTags = `
        <title>Meta Title</title>
        <meta name="description" content="Meta Description"/>  
      `
      const html = template.replace(`<!--meta-tags-->`, metaTags)
      res.status(200).set({ "content-Type": "text/html" }).end(html)
    } catch (error) {
      console.log("Error processing request:", error);
      res.status(500).end('Internal Server Error')
    }
  })

  app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
  })
}

startServer()
module.exports = app
export const handler = serverless(app);
module.exports.handler = handler
