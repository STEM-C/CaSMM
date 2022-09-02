module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/sandbox/toolbox',
      handler: 'sandbox.toolbox',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/sandbox/submission/:id',
      handler: 'sandbox.findOneSubmission',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/sandbox/submission',
      handler: 'sandbox.createSubmission',
      config: { policies: [] }
    }
  ]
}