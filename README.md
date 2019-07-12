# Conference Management App

## Installation

### Salesforce Org Setup

1. Navigate to `sfdx-project`
2. Run `install.sh`
3. Create a **Connected App** with these settings:

    | Attribute             | Value                                 |
    | --------------------- | ------------------------------------- |
    | Connected App Name    | Conference Management API             |
    | Enable OAuth Settings | checked                               |
    | Contact Email         | &lt;your_email&gt;                    |
    | Callback URL          | http://localhost:3002/oauth2/callback |
    | Selected OAuth Scopes | Access and manage your data (api)     |

4. Copy the **Consumer Key** and **Consumer Secret** values for the Node app configuration.

### Node App Configuration

## Configuration

Create a `.env` file in the root folder of your project with this content:

```
SFDC_LOGIN_DOMAIN='https://test.salesforce.com/'
SFDC_CLIENT_ID=''
SFDC_CLIENT_SECRET=''
SFDC_CALLBACK_URL='http://localhost:3002/oauth2/callback'
NODE_SESSION_SECRET_KEY=''
```

Update the values of the following properties:

-   **SFDC_CLIENT_ID**: Consumer Key from the Connected App created in Salesforce
-   **SFDC_CLIENT_SECRET**: Consumer Secret from the Connected App created in Salesforce
-   **NODE_SESSION_SECRET_KEY**: Key used for signing and/or encrypting cookies set by the application to maintain session state

## Node App Startup

1. Build the app with `npm run build`
2. Start the app with `npm run serve`
