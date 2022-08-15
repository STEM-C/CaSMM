module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/blocks',
      handler: 'block.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/blocks/:id',
      handler: 'block.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/blocks',
      handler: 'block.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/blocks/:id',
      handler: 'block.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/blocks/:id',
      handler: 'block.delete',
      config: { policies: [] }
    }
  ]
}