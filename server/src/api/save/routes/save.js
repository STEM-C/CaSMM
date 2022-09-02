module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/saves',
      handler: 'save.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/saves/day/:day',
      handler: 'save.findByDay',
      config: { policies: [ 'global::isStudent' ] }
    },
    {
      method: 'GET',
      path: '/saves/:id',
      handler: 'save.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/saves',
      handler: 'save.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/saves/:id',
      handler: 'save.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/saves/:id',
      handler: 'save.delete',
      config: { policies: [] }
    }
  ]
}