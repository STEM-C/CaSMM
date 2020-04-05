# STEM+C



## Scaffolds

### Project

 
#### Client
The [frontend](https://github.com/EngagingLearningLab/STEM-C/tree/master/client#client) is built on top of [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly). It will be deployed in the cloud and distributed with a CDN.

#### Server
The [backend](https://github.com/EngagingLearningLab/STEM-C/tree/master/server#server) is built on top of a [headless CMS](https://headlesscms.org/). It will be deployed in the cloud and utilize various services.


## Environments

### Development
This project's dependencies are managed through [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) (this must be installed) using [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). This allows both client and server folder dependencies to only depend on one package-lock file, reducing possible dependency version issues. From the project root running the command `yarn` will install dependencies for both the client and server.
The following are the available scripts we can use with the client and server: 
#### `yarn workspace server dev`
Runs both the client app and the server app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.<br><br>

#### `yarn workspace client start`
Runs just the client app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.<br><br>


#### `yarn workspace server start`
Runs just the server in development mode.<br><br>


#### `yarn workspace server build`
Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.<br><br>


### Deployment

Coming soon...



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
