# STEM+C

<br/>

## Scaffolds

### `/`  

#### `client/` 
[Client](/client/#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

#### `cms/`

[Cms](/cms#cms) is the REST API and admin portal that powers the backend. It is powered by [Node](https://nodejs.org/en/) and [Strapi]().

#### `compile/`

[Compile](/compile/#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

The project is divided into three conceptual environments.
### Development

#### Structure

The development environment is comprised of four servers managed by [docker compose](https://docs.docker.com/compose/).

* `stem-c-client-dev` - localhost:3000
* `stem-c-cms-dev` - localhost:1337
* `stem-c-compile-dev` - localhost:8080
* `stem-c-db-dev` - localhost:5432

#### Running

`stem-c-cms-dev`, `stem-c-compile-dev`, and `stem-c-db-dev`

1. Install [docker](https://docs.docker.com/get-docker/)
3. Run `docker-compose up` 

`stem-c-client-dev`

1. Run `cd client`
2. Run `yarn install`
3. Run `yarn start`

### Staging

#### Structure

The staging environment is deployed on Heroku. It is comprised of one app running a Heroku Postgres instance and a web container.

* `stem-c-staging` - [stem-c-staging.herokuapp.com](https://stem-c-staging.herokuapp.com/)
  * The web container attached to this Heroku app runs `cms` and serves static `client` build files
  * The Heroku Postgres instance is attached as an add-on

#### Running

`stem-c-staging` is automatically built from the latest commits to `develop` . Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is deployed on Heroku. It is comprised of two apps. One is running a Heroku Postgres instance and a web container and the other is running just a web container.

* `stem-c` - [stem-c.herokuapp.com](https://stem-c.herokuapp.com/)
  * The web container attached to this Heroku app runs `cms` and serves static `client` build files
  * The Heroku Postgres instance is attached as an add-on
* `stem-c-compile` - [stem-c-compile.herokuapp.com](https://stem-c-compile.herokuapp.com/)
  * The web container attached to this Heroku app runs `compile`

#### Running

`stem-c` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

`stem-c-compile` is manually deployed through the Heroku CLI.

1. Download [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run the following commands sequentially

```bash
heroku login
heroku git:remote -a stem-c-compile
heroku container:login
heroku container:push web
heroku container:release web
```

<br/>

## Contributing

### Git Flow 

![Git Flow](https://nvie.com/img/git-model@2x.png)

Ideally, we want our flow to resemble this. Master and develop are locked for direct commits. All commits must be made to a non-protected branch and submitted via a pull request with one approving review.

### Branches

- `master` - Production application
- `release/<version>` - Staged version
- `develop` - Working version of the application
- `feature/<scaffold>-<feature-name>` - Based off of develop
  - ex. `feature/cms-strapi`
- `hotfix/<scaffold>-<fix-name>` - Based off of master
  - ex. hotfix/client-cors

### Pull Requests

Before submitting a pull request, merge the target branch into the working branch to resolve any merge conflicts. Include a description of the changes made.
