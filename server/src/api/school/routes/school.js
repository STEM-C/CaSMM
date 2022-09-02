module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/schools',
      handler: 'school.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/schools/:id',
      handler: 'school.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/schools',
      handler: 'school.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/schools/:id',
      handler: 'school.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/schools/:id',
      handler: 'school.delete',
      config: { policies: [] }
    }
  ]
}