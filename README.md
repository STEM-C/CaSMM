# STEM+C

<br/>

## Scaffolds

### `/`  

- #### `client/` 
  [Client](/client/#client) is the frontend of the applcation. It built on top of [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

- #### `cms/`

  [Cms](/cms#cms) is the REST API and admin portal that defines the backend.

- #### `compile/`

  [Compile](/compile/#compile) is a service that runs in the backend.

  <br/>

## Environments

### Development

The development environment is setup with docker compose as three services.

* `sc-cms-dev` => localhost:1337
* `sc-compile-dev` => localhost:3000
* `sc-db-dev` => localhost:3306

To get started, simply 

1. Install [docker](https://docs.docker.com/get-docker/)
2. Add strapi.sql to cms/
3. Run `docker-compose up` 

### Deployment

TODO

<br/>

## Contributing

### Git Flow 

![Git Flow](https://nvie.com/img/git-model@2x.png)

Ideally, we want our flow to resemble this. Master and develop are locked for direct commits. All commits must be made to a non-protected branch and submitted via a pull request with one approving review.

### Branches

- `master` - Deployed version of the application 
- `develop` - Working version of the application
- `feature/<scaffold>-<feature-name>` - Based off of develop
  - ex. `feature/server-strapi`
- `hotfix/<scaffold>-<fix-name>` - Based off of master
  - ex. hotfix/client-cors

### Pull Requests

Before submitting a pull request, merge the target branch into the working branch to resolve any merge conflicts. Include a description of the changes made.
