module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/mentors',
      handler: 'mentor.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/mentors/:id',
      handler: 'mentor.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/mentors',
      handler: 'mentor.create',
      config: { policies: [ 'global::isClassroomManager' ] }
    },
    {
      method: 'PUT',
      path: '/mentors/:id',
      handler: 'mentor.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/mentors/:id',
      handler: 'mentor.delete',
      config: { policies: [] }
    }
  ]
}