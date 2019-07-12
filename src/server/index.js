/* eslint-disable no-console */

const authService = require('./auth');
const integrationService = require('./integration');
const jsforce = require('jsforce');
const session = require('express-session');

// Load .env configuration file
require('dotenv').config();

module.exports = app => {
    // Retrieve config
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URL;
    const sessionSecretKey = process.env.SESSION_SECRET_KEY;

    // Check config
    if (!(clientId && clientSecret && redirectUri && sessionSecretKey)) {
        console.error(
            'Cannot start app: missing mandatory configuration. Check your .env file or your environment variables.'
        );
        process.exit(-1);
    }

    // Initialize OAuth2 config
    const oauth2 = new jsforce.OAuth2({
        clientId,
        clientSecret,
        redirectUri
    });

    // Enable server-side sessions
    app.use(
        session({
            secret: sessionSecretKey,
            cookie: { secure: 'auto' },
            resave: false,
            saveUninitialized: false
        })
    );

    // Login to Salesforce
    app.get('/oauth2/login', (req, res) => {
        authService.redirectToAuthUrl(res, oauth2);
    });

    // Callback function to get Auth Token
    app.get('/oauth2/callback', (req, res) => {
        authService.doCallback(req, res, oauth2);
    });

    // Get Logged In User Details
    app.get('/oauth2/whoami', (req, res) => {
        authService.getLoggedInUserDetails(req, res);
    });

    // Logout from Salesforce
    app.get('/oauth2/logout', (req, res) => {
        authService.doLogout(req, res, oauth2);
    });

    // Get Conference-Session Details
    app.get('/api/conference-sessions/:id?', (req, res) => {
        integrationService.getConferenceSessionDetails(req, res);
    });
};
