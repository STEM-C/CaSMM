module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // url: 'localhost:1337',
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'fd6af0fac10670ef12e9d518d1604298'),
    },
  },
});
