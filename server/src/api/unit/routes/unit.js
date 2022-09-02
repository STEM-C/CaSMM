module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/units',
      handler: 'unit.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/units/:id',
      handler: 'unit.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/units',
      handler: 'unit.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/units/:id',
      handler: 'unit.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/units/:id',
      handler: 'unit.delete',
      config: { policies: [] }
    }
  ]
}