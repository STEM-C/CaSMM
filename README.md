# STEM+C



## Scaffolds

### Project

#### Client
The [frontend](https://github.com/EngagingLearningLab/STEM-C/tree/master/client#client) is built on top of [React](https://reactjs.org/) and [Blockly](https://developers.google.com/blockly). It will be deployed in the cloud and distributed with a CDN.

#### Server

The [backend](https://github.com/EngagingLearningLab/STEM-C/tree/master/server#server) is built on top of a [headless CMS](https://headlesscms.org/). It will be deployed in the cloud and utilize various services.



## Environments

### Development

Coming soon...

### Deployment

Coming soon...



## Contributing

### Git Flow 

Master is locked for direct commits. All commits must be made to a non-protected branch and submitted via a pull request with one approving review.

### Branches

- `master` - Deployed version of the application 
- `develop` - Working version of the application
- `feature/<scaffold>-<feature-name>` - Based off of develop
  - ex. `feature/server-strapi`
- `hotfix/<scaffold>-<fix-name>` - Based off of master
  - ex. fotfix/client-cors

### Pull Requests

Before submitting a pull request, merge the target branch into the working branch to resolve any merge conflicts. Pull requests for the master branch must be approved by one reviewer. 