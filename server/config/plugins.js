require('dotenv').config({ path: '../.env' });
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

module.exports = () => ({
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      auth: {
        user: process.env.EMAIL_SMTP_USER,
        pass: process.env.EMAIL_SMTP_PASS,
      },
    },
    settings: {
      defaultFrom: 'no-reply@casmm.org',
      defaultReplyTo: 'no-reply@casmm.org',
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DNS || '',
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    tracesSampleRate: 1.0,
  },
});
