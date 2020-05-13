/**
 * parses a PostgreSQL DB connection URL into the parts needed
 * by Strapi. Without this, heroku may throw ECONNREFUSED 127.0.0.1:xxxx.  
 */

const url = require('url');

let settings = {
  client: 'postgres'
};

if (process.env.DATABASE_URL) {
  const parsed = url.parse(process.env.DATABASE_URL, true);
  const [username, password] = parsed.auth.split(':');

  settings.host     = parsed.hostname;
  settings.port     = Number(parsed.port);
  settings.database = parsed.pathname.substr(1);
  settings.username = username;
  settings.password = password;
}

module.exports = {
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings,
      options: {}
    }
  }
};