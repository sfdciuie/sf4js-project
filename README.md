# Conference Management App

## Installation

### Salesforce Org Setup

1. Navigate to `sfdx-project`
2. Run `install.sh`
3. Create a **Connected App** with these settings:
   | Attribute | Value |
   | ------------- |-------------|
   | Connected App Name | Conference Management API |
   | Enable OAuth Settings | checked |
   | Contact Email | &lt;your_email&gt; |
   | Callback URL | http://localhost:3002/oauth2/callback |
   | Selected OAuth Scopes | Access and manage your data (api) |
4. Copy the **Consumer Key** and **Consumer Secret** values for the Node app configuration.

### Node App Configuration

1. Create a .env file in the root folder of your project
2. Add the below 4 entries to the file.
    - **CLIENT_ID**: Client Id from the Connected App created in Salesforce
    - **CLIENT_SECRET**: Client Secret from the Connected App created in Salesforce
    - **REDIRECT_URL**: URL to which the user gets redirected to, once they finish the Salesforce authorization process. Must be one of the URLs configured in the Connected App
    - **SESSION_SECRET_KEY**: Key used for signing and/or encrypting cookies set by the application to maintain session state

Find more information on the main repo on [GitHub](https://github.com/muenzpraeger/lwc-create-app).

## Node App Startup

1. Build the app with `npm run build`
2. Start the app with `npm run serve`
