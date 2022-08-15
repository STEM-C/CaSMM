module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/cc-workspaces',
      handler: 'cc-workspace.find',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/cc-workspaces/:id',
      handler: 'cc-workspace.findOne',
      config: { policies: [ 'is-content-creator-or-has-classroom' ] }
    },
    {
      method: 'GET',
      path: '/cc-workspaces/toolbox/:id',
      handler: 'cc-workspace.toolbox',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/cc-workspaces',
      handler: 'cc-workspace.create',
      config: { policies: [ 'is-content-creator-or-has-classroom' ] }
    },
    {
      method: 'PUT',
      path: '/cc-workspaces/:id',
      handler: 'cc-workspace.update',
      config: { policies: [ 'is-content-creator-or-has-classroom' ] }
    },
    {
      method: 'DELETE',
      path: '/cc-workspaces/:id',
      handler: 'cc-workspace.delete',
      config: { policies: [ 'is-content-creator-or-has-classroom' ] }
    }
  ]
}