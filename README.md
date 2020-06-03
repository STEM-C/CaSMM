# STEM+C

> Cloud-based programming interface

<br/>

## Scaffolds

### `/`  

#### `client/` 
[Client](/client#client) is the frontend of the application. It is powered by [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly).

#### `cms/`

[Cms](/cms#cms) is the REST API and admin portal that powers the backend. It is powered by [Node](https://nodejs.org/en/) and [Strapi]().

#### `compile/`

  [Compile](/compile#compile) is an arduino compiler service. It is an unofficial fork of [Chromeduino](https://github.com/spaceneedle/Chromeduino).

<br/>

## Environments

> The project is divided into three conceptual environments.

### Development
This project's dependencies are managed through [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable). This effectively replaces npm and should be used in place of npm everywhere except sc-compile-dev.
The following are the available scripts we can use with the client and server: 

#### Structure

The development environment is composed of four servers. The first one is run with the [Create React App](https://create-react-app.dev/docs/getting-started/) dev server. The later three are containerized with docker and run with [docker compose](https://docs.docker.com/compose/).

* `stem-c-client-dev` - localhost:3000
* `stem-c-cms-dev` - localhost:1337
* `stem-c-compile-dev` - localhost:8080
* `stem-c-db-dev` - localhost:5432

#### Running

`stem-c-client-dev`

1. Follow the [client](/client#setup) setup
2. Run `yarn start` from `/client`

`stem-c-cms-dev`, `stem-c-compile-dev`, and `stem-c-db-dev`

1. Install [docker](https://docs.docker.com/get-docker/)

   > If you do not meet these [requirements](https://docs.docker.com/toolbox/toolbox_install_windows/) docker desktop will not initialize properly. There are some unofficial modifications, however, we recommend installing the docker [toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) 

2. Add **dev_db.dump** to `scripts/`

   > Pinned in the #dev channel

3. Run `docker-compose up` from `/`

   > Grant permission to the **scripts** and **cms** directories if you are prompted

### Staging

#### Structure

The staging environment is deployed on Heroku. It is composed of one app running a Heroku Postgres instance and a web container.

* `stem-c-staging` - [stem-c-staging.herokuapp.com](https://stem-c-staging.herokuapp.com/)
  * The web container attached to this Heroku app runs `cms` and serves static `client` build files
  * The Heroku Postgres instance is attached as an add-on

#### Running

`stem-c-staging` is automatically built from the latest commits to `release`. Heroku runs the container orchestration from there.

### Production

#### Structure

The production environment is deployed on Heroku. It is composed of two apps. One is running a Heroku Postgres instance and a web container and the other is running just a web container.

* `stem-c` - [stem-c.herokuapp.com](https://stem-c.herokuapp.com/)
  * The web container attached to this Heroku app runs `cms` and serves static `client` build files
  * The Heroku Postgres instance is attached as an add-on
* `stem-c-compile` - [stem-c-compile.herokuapp.com](https://stem-c-compile.herokuapp.com/)
  * The web container attached to this Heroku app runs `compile`

#### Running

`stem-c` is automatically built from the latest commits to `master`. Heroku runs the container orchestration from there.

`stem-c-compile` is manually deployed through the [Container Registry](https://devcenter.heroku.com/articles/container-registry-and-runtime) and [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run the following commands sequentially

```powershell
heroku login
heroku git:remote -a stem-c-compile
heroku container:login
heroku container:push web
heroku container:release web
```

<br/>

## Contributing

### Git Flow 

> We will follow this git flow for the most part — instead of individual release branches, we will have one to streamline staging deployment 

![Git Flow](https://nvie.com/img/git-model@2x.png)

### Branches

#### Protected

> Locked for direct commits — all commits must be made from a non-protected branch and submitted via a pull request with one approving review

- **master** - Production application

#### Non-protected

> Commits can be made directly to the branch

- **release** - Staging application
- **develop** - Working version of the application
- **feature/<`scaffold`>-<`feature-name`>** - Based off of develop
  - ex. **feature/cms-strapi**
- **hotfix/<`scaffold`>-<`fix-name`>** - Based off of master
  - ex. **hotfix/client-cors**

### Pull Requests

Before submitting a pull request, merge the target branch into the working branch to resolve any merge conflicts. Include a description of the changes made.

- PRs to **master** should squash and merge
- PRs to all other branches should create a merge commit

