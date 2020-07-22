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
      // Configuration from middlewares/frontend/defaults.json
      const { path: frontendPath, routes } = strapi.config.middleware.settings.frontend
      const frontendDir = path.resolve(strapi.dir, frontendPath)

      const serveFrontend = ctx => {
          ctx.type = 'html'
          ctx.body = fs.createReadStream(path.join(frontendDir + '/index.html'))
      }

      // Serve the index.html for all client routes 
      // This allows the react router to work properly
      routes.forEach(path => strapi.router.get(path, serveFrontend))
    },
  }
}