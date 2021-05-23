/**
 * parses a PostgreSQL DB connection URL into the parts needed
 * by Strapi. Without this, heroku may throw ECONNREFUSED 127.0.0.1:xxxx.  
 */

const url = require('url')

if (process.env.DATABASE_URL) {
	const parsed = url.parse(process.env.DATABASE_URL, true)
	const [username, password] = parsed.auth.split(':')

	process.env.DATABASE_HOST = parsed.hostname
	process.env.DATABASE_PORT = Number(parsed.port)
	process.env.DATABASE_NAME = parsed.pathname.substr(1)
	process.env.DATABASE_USERNAME = username
	process.env.DATABASE_PASSWORD = password
}

module.exports = ({ env }) => ({
	defaultConnection: 'default',
	connections: {
		default: {
			connector: 'bookshelf',
			settings: {
				client: 'postgres',
				host: env('DATABASE_HOST', 'localhost'),
				port: env.int('DATABASE_PORT', 5432),
				database: env('DATABASE_NAME', 'strapi'),
				username: env('DATABASE_USERNAME', 'postgres'),
				password: env('DATABASE_PASSWORD', 'postgres'),
				schema: 'public',
				ssl: env('NODE_ENV') == 'production' 
				? { rejectUnauthorized: false }
				: false
			},
			options: {
				'pool': {
					'min': 0,
					'max': 15,
					'idleTimeoutMillis': 30000,
					'createTimeoutMillis': 30000,
					'acquireTimeoutMillis': 30000
				}
			}
		},
	},
})