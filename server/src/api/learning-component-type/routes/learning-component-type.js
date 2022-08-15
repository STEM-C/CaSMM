module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/learning-component-types',
      handler: 'learning-component-type.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/learning-component-types/:id',
      handler: 'learning-component-type.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/learning-component-types',
      handler: 'learning-component-type.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/learning-component-types/:id',
      handler: 'learning-component-type.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/learning-component-types/:id',
      handler: 'learning-component-type.delete',
      config: { policies: [] }
    }
  ]
}