module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/learning-components',
      handler: 'learning-component.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/learning-components/:id',
      handler: 'learning-component.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/learning-components',
      handler: 'learning-component.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/learning-components/:id',
      handler: 'learning-component.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/learning-components/:id',
      handler: 'learning-component.delete',
      config: { policies: [] }
    }
  ]
}