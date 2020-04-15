# STEM+C

<br/>

## Scaffolds

### `/`  

- #### `client/` 
  [Client](/client/#client) is the frontend of the applcation. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

- #### `cms/`

  [Cms](/cms#cms) is the REST API and admin portal that powers the backend. It is powered by [Node](https://nodejs.org/en/) and [Strapi]().

- #### `compile/`

  [Compile](/compile/#compile) is an arduino compilier service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

  <br/>

## Setup

### Development

The development environment is comprised of three services managed by docker compose.

* `sc-cms-dev` => localhost:1337
* `sc-compile-dev` => localhost:8080
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
