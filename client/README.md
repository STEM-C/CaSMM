# Client

> [React.js](https://reactjs.org/) application which represents the entire browser-side client. File structure is standard for a [create-react-app](https://github.com/facebook/create-react-app) application with some minor changes. Any component which represents an entire page is categorized under the [views](/client/src/views) folder.

<br />

## Setup

1. Install [Node](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable)
2. Run `yarn` to install project dependencies
3. Run `yarn start` to startup the client (please note that much of the functionality will not work without also starting up the backend services)
4. Navigate to chrome://flags/ and enable the #enable-experimental-web-platform-features flag (This will provide your browser access to serial ports)

<br />

## Project Structure

This react project has the following file structure rules:
1. Routing is handled from client root in `App.js`, rendered in react by `index.js`
2. Components which render as a page are generally listed under the `/views` folder
3. Component styling is placed into a folder under the name of the main component alongside the component and sub-component files. 
    - As an example the folder `/Home` contains the `Home.js` component, the `Home.css` styling, and a couple of sub-components.
4. `/Utils` contains additional utility functions like different database requests or authentication handlers

<br/>

## Routing

All client routes are handled by react router. The **index.html** file and all static assets will be served by the [server](/server#static-assets).

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

## Styling

To maintain a consistant theme the folowing has been implemented in `\client\src\assets\style.less` for import

### Colors

    primary: #3D5C82;
    secondary: #5BABDE;
    tertiary: #F4F4F5;
    text-primary: #414141;
    text-secondary: #FFFFFF;

<br />

### Relevant notes

Section on fixing issue where yarn build does not minify: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

Section on code splitting, worth considering at some point: https://facebook.github.io/create-react-app/docs/code-splitting
