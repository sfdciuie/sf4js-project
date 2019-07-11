# conference-management

Here will be some information about the app.

## How to start?

Start simple by running `yarn watch` (or `npm run watch`, if you set up the project with `npm`). This will start the project with a local development server.

The source files are located in the [`src`](./src) folder. All web components are within the [`src/client/modules`](./src/modules) folder. The folder hierarchy also represents the naming structure of the web components. The entry file for the custom Express configuration can be found in the ['src/server'](./src/server) folder..

## Configuration

Create a `.env` file in the root folder of your project with this content:

```
CLIENT_ID=''
CLIENT_SECRET=''
REDIRECT_URL='http://localhost:3002/oauth2/callback'
SESSION_SECRET_KEY=''
```

Update the values of the following properties:

-   **CLIENT_ID**: Client Id from the Connected App created in Salesforce
-   **CLIENT_SECRET**: Client Secret from the Connected App created in Salesforce
-   **SESSION_SECRET_KEY**: Key used for signing and/or encrypting cookies set by the application to maintain session state
