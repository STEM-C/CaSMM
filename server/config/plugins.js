require('dotenv').config({ path: '../.env' });

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
    dsn: 'https://1211be7d90e04b218083d8a8b760e4d6@o1050432.ingest.sentry.io/6031665',
  },
});
