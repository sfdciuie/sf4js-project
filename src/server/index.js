/* eslint-disable no-console */

var authTools = require("./auth");
var integrationTools = require("./integration");

module.exports = app => {
    require('dotenv').config();

    const jsforce = require('jsforce');
    const session = require('express-session');

    //Retrieve OAuth Information from .env file
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URL;
    const sessionSecretKey = process.env.sessionSecretKey;

    const oauth2 = new jsforce.OAuth2({
        clientId,
        clientSecret,
        redirectUri
    });

    if (!(clientId && clientSecret && redirectUri && sessionSecretKey) ){
        throw new Error('Configuration Params missing');
    }

    // Enable server-side sessions
    app.use(
        session({
            secret: sessionSecretKey,
            cookie: { secure: 'auto' },
            resave: false,
            saveUninitialized: false
        })
    );

    
    //Login to Salesforce
    app.get('/oauth2/login', (req, res) => {
        authTools.redirectToAuthUrl(res, oauth2);
    });

    //Callback function to get Auth Token
    app.get('/oauth2/callback', (req, res) => {
        authTools.doCallback(req, res, oauth2);
    });

    //Get Logged In User Details
    app.get('/oauth2/whoami', (req, res) => {
        authTools.getLoggedInUserDetails(req, res);
    });

    //Logout from Salesforce
    app.get('/oauth2/logout', (req, res) => {
        authTools.doLogout(req, res, oauth2);
    });

    //Get Conference-Session Details
    app.get('/api/conference-sessions/:conferencesessionid?', (req,res) => {
        integrationTools.getConferenceSessionDetails(req, res);
    });
};
