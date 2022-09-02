module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/submissions',
      handler: 'submission.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/submissions/:id',
      handler: 'submission.findOne',
      config: { policies: [ 'global::isStudent' ] }
    },
    {
      method: 'POST',
      path: '/submissions',
      handler: 'submission.create',
      config: { policies: [ 'global::isStudent' ] }
    },
    {
      method: 'PUT',
      path: '/submissions/:id',
      handler: 'submission.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/submissions/:id',
      handler: 'submission.delete',
      config: { policies: [] }
    }
  ]
}