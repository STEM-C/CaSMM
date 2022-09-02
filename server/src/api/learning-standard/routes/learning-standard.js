module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/learning-standards',
      handler: 'learning-standard.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/learning-standards/:id',
      handler: 'learning-standard.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/learning-standards',
      handler: 'learning-standard.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/learning-standards/:id',
      handler: 'learning-standard.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/learning-standards/:id',
      handler: 'learning-standard.delete',
      config: { policies: [] }
    }
  ]
}