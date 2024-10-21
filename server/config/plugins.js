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
  upload: {
    config: {
      provider: 'local', // or another provider like 'aws-s3'
      providerOptions: {
        //sizeLimit: 1000000, // Set a file size limit in bytes (optional)
        // Additional provider-specific configuration, e.g., AWS S3 credentials
        local: {
          path: './public/uploads',
          keepExtensions: true, // Preserve file extensions during upload
        },
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
});
