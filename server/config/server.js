module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // url: 'localhost:1337',
  admin: {
    url: env('URL', '/admin'),
    // serveAdminPanel: false
    auth: {
      secret: env(
        'ADMIN_JWT_SECRET',
        process.env.JWT_SECRET || '58cb969b-bb0e-4492-9d8f-1306100e1f90'
      ),
    },
  },
});
