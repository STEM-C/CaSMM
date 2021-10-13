require('dotenv').config({ path: '../.env' })


module.exports = () => ({
    // ...
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
    // ...
  })