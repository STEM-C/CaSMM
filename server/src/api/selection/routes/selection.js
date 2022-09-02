module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/selections',
      handler: 'selection.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/selections/:id',
      handler: 'selection.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/selections',
      handler: 'selection.create',
      config: {
        policies: [ 'global::isClassroomManager', 'global::hasClassroom' ]
      }
    },
    {
      method: 'PUT',
      path: '/selections/:id',
      handler: 'selection.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/selections/:id',
      handler: 'selection.delete',
      config: { policies: [] }
    }
  ]
}