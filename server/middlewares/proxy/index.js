'use strict';

/**
 * Module dependencies
 */
const fs = require('fs');
const path = require('path');

module.exports = (strapi) => {
  return {
    /**
     * Initialize the hook
     */

    initialize() {
      strapi.app.use(async (ctx, next) => {
        const reqPath = ctx.request.path;
        const reqHost = ctx.request.header.host;
        const reqReferer = ctx.request.header.referer;
        const refererUrl = reqReferer
          ? reqReferer
              .replace('http://', '')
              .replace('https://', '')
              .replace(reqHost, '')
          : '';

        if (
          reqPath === '/favicon.ico' ||
          reqPath.startsWith('/admin') ||
          reqPath.startsWith('/client') ||
          refererUrl.startsWith('/admin') ||
          reqPath.startsWith('/documentation') ||
          refererUrl.startsWith('/documentation')
        ) {
          // if request for favicon, admin, or client or if request from admin, go next
          await next();
        } else if (reqPath.startsWith('/api')) {
          // if api request, remove /api
          ctx.request.path = reqPath.replace('/api', '');
          await next();
        } else {
          // serve the index.html for the client route
          const { clientPath } = strapi.config.middleware.settings.proxy;
          const clientDir = path.resolve(strapi.dir, clientPath);

          ctx.type = 'html';
          ctx.body = fs.createReadStream(path.join(clientDir + '/index.html'));
        }
      });
    },
  };
};
