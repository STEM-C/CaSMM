require("dotenv").config({ path: "../.env" })
const Sentry = require("@sentry/node")

module.exports = () => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
          user: process.env.EMAIL_SMTP_USER,
          pass: process.env.EMAIL_SMTP_PASS,
        },
      },
      settings: {
        defaultFrom: "no-reply@casmm.org",
        defaultReplyTo: "no-reply@casmm.org",
      },
    },
  },
  "users-permissions": {
    config: {
      jwtSecret:
        process.env.JWT_SECRET || "58cb969b-bb0e-4492-9d8f-1306100e1f90",
      jwt: {
        expiresIn: "7d",
      },
    },
  },
  sentry: {
    config: {
      dsn: process.env.SENTRY_DNS || "",
      integrations: [new Sentry.Integrations.Http({ tracing: true })],
      tracesSampleRate: 1.0,
    },
  },
})
