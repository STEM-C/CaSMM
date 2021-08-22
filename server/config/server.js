module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // url: 'localhost:1337',
  admin: {
    auth: {
      secret: env(
        'ADMIN_JWT_SECRET',
        process.env.ADMIN_JWT_TOKEN ||
          'fd6af0fac1067asfasf0ef12AGWADGJe9d518d1604298'
      ),
    },
  },
});
