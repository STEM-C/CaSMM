# Client

> [React.js](https://reactjs.org/) application which represents the entire browser-side client. File structure is standard for a [create-react-app](https://github.com/facebook/create-react-app) application with some minor changes. Any component which represents an entire page is categorized under the [views](/client/src/views) folder.

<br />

## Setup

1. Install [Node](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)
2. Run `yarn` to install project dependencies

<br />

## Routing

All client routes must be registered in the cms frontend middleware to ensure they are handled by react. Additional information and implementation instructions are in the [cms](/cms#static-assets) documentation.

<br/>

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn start-build`

Stars a basic http server (using [http-server](https://www.npmjs.com/package/http-server)) which serves the build folder on [http://localhost:3000](http://localhost:3000) .

### `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

<br />

### Relevant notes

Section on fixing issue where yarn build does not minify: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

Section on code splitting, worth considering at some point: https://facebook.github.io/create-react-app/docs/code-splitting
