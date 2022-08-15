module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/sessions',
      handler: 'session.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/sessions/:id',
      handler: 'session.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/sessions',
      handler: 'session.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/sessions/:id',
      handler: 'session.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/sessions/:id',
      handler: 'session.delete',
      config: { policies: [] }
    }
  ]
}