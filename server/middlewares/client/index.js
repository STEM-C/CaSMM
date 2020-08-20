'use strict'

/**
 * Module dependencies
 */
const fs = require('fs')
const path = require('path')

module.exports = strapi => {
  return {
    /**
     * Initialize the hook
     */

    async initialize() {
      // Configuration from middlewares/client/defaults.json
      const { path: clientPath, routes } = strapi.config.middleware.settings.client
      const clientDir = path.resolve(strapi.dir, clientPath)

      const serveClient = ctx => {
          ctx.type = 'html'
          ctx.body = fs.createReadStream(path.join(clientDir + '/index.html'))
      }

      // Serve the index.html for all client routes 
      // This allows the react router to work properly
      routes.forEach(path => strapi.router.get(path, serveClient))
    },
  }
}