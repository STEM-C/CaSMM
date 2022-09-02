module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/bug-report',
      handler: 'email.send',
      config: {}
    }
  ]
}