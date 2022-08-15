module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/grades',
      handler: 'grade.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/grades/:id',
      handler: 'grade.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/grades',
      handler: 'grade.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/grades/:id',
      handler: 'grade.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/grades/:id',
      handler: 'grade.delete',
      config: { policies: [] }
    }
  ]
}