const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv')
const fs = require('fs')
const proxy = require('express-http-proxy')
const _ = require('lodash')

dotenv.config()

app.use(express.static('./static'))

// TODO: Extract in shared module
const httpProxy = (originPath, targetPath, targetHost) => {
  app.use(
    originPath,
    proxy(targetHost, {
      proxyReqPathResolver: (req, res) => new Promise((resolve, reject) => resolve(targetPath))
    })
  )
}

httpProxy('/api/modules', '/api/v1/modules', process.env.CORE_API_URL)
httpProxy('/js/modules/channel-web', '/api/v1/modules/channel-web', process.env.CORE_API_URL)
httpProxy('/api/bot/information', '/api/v1/bots/bot123/', process.env.CORE_API_URL)
httpProxy('/api/middlewares', '/api/v1/middlewares/bots/bot123', process.env.CORE_API_URL)

app.get('/js/env.js', (req, res) => {
  res.contentType('text/javascript')
  res.send(`
    (function(window) {
        window.NODE_ENV = "production";
        window.BOTPRESS_ENV = "dev";
        window.BOTPRESS_CLOUD_ENABLED = false;
        window.BOTPRESS_CLOUD_SETTINGS = {"botId":"","endpoint":"","teamId":"","env":"dev"};
        window.DEV_MODE = true;
        window.AUTH_ENABLED = false;
        window.AUTH_TOKEN_DURATION = 21600000;
        window.OPT_OUT_STATS = false;
        window.SHOW_GUIDED_TOUR = false;
        window.BOTPRESS_VERSION = "10.22.3";
        window.APP_NAME = "Botpress";
        window.GHOST_ENABLED = false;
        window.BOTPRESS_FLOW_EDITOR_DISABLED = null;
      })(typeof window != 'undefined' ? window : {})
    `)
})

app.get('/js/commons.js', (req, res) => {
  const absolutePath = path.join(__dirname, 'static/commons.js')

  res.contentType('text/javascript')
  res.sendFile(absolutePath)
})

app.get('/js/web.729e9680ac37ff307159.js', (req, res) => {
  const absolutePath = path.join(__dirname, 'static/web.729e9680ac37ff307159.js')

  res.contentType('text/javascript')
  res.sendFile(absolutePath)
})

app.get('/api/notifications/inbox', (req, res) => {
  res.send('[]')
})

app.get('/api/community/hero', (req, res) => {
  res.send({ hidden: true })
})

app.get('/api/botpress-plateforme-webchat/inject.js', (req, res) => {
  const absolutePath = path.join(__dirname, 'static/inject.js')

  res.contentType('text/javascript')
  res.sendFile(absolutePath)
})

app.get('/*', (req, res) => {
  const absolutePath = path.join(__dirname, 'static/index.html')

  res.contentType('text/html')
  res.sendFile(absolutePath)
})

app.listen(process.env.HOST_PORT, () =>
  console.log('Botpress is now running on %s:%d', process.env.HOST_URL, process.env.HOST_PORT)
)
