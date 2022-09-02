module.exports = ({ env }) => ({
  apiToken: {
    salt: env("API_TOKEN_SALT", "d9b0df66ff97a666027e665707b4e3e7"),
  },
  auth: {
    secret: env(
      "ADMIN_JWT_SECRET",
      process.env.ADMIN_JWT_TOKEN ||
        "fd6af0fac1067asfasf0ef12AGWADGJe9d518d1604298"
    ),
  },
})
