module.exports = [
  "strapi::errors",
  "strapi::cors",
  "strapi::public",
  "strapi::security",
  {
    name: "strapi::public",
    config: {
      maxAge: 60000,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::favicon",
]
