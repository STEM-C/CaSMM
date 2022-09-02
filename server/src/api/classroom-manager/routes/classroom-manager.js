module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/classroom-managers/me',
      handler: 'classroom-manager.me',
      config: { policies: [ 'global::isClassroomManager' ] }
    }
  ]
}