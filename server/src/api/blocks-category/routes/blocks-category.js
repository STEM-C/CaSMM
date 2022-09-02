module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/blocks-categories',
      handler: 'blocks-category.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/blocks-categories/:id',
      handler: 'blocks-category.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/blocks-categories',
      handler: 'blocks-category.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/blocks-categories/:id',
      handler: 'blocks-category.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/blocks-categories/:id',
      handler: 'blocks-category.delete',
      config: { policies: [] }
    }
  ]
}