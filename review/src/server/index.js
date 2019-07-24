const AuthenticationService = require('./authenticationService');
const IntegrationService = require('./integrationService');
const jsforce = require('jsforce');
const session = require('express-session');
const winston = require('winston');

// Load .env configuration file
require('dotenv').config();

// Init logger
// In production, we should write to a file, not just console
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Retrieve configuration
const loginUrl = process.env.SALESFORCE_LOGIN_DOMAIN;
const clientId = process.env.SALESFORCE_CLIENT_ID;
const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
const redirectUri = process.env.SALESFORCE_CALLBACK_URL;
const sessionSecretKey = process.env.NODE_SESSION_SECRET_KEY;
// Check configuration
if (
    !(loginUrl && clientId && clientSecret && redirectUri && sessionSecretKey)
) {
    logger.error(
        'Cannot start app: missing mandatory configuration. Check your .env file or your environment variables.'
    );
    process.exit(-1);
}

module.exports = app => {
    // Initialize OAuth2 config
    const oauth2 = new jsforce.OAuth2({
        loginUrl,
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

    // Build services
    const authService = new AuthenticationService(logger, oauth2);
    const integrationService = new IntegrationService(logger, authService);

    // Hook up REST endpoints with service calls

    // Login to Salesforce
    app.get('/oauth2/login', (req, res) => {
        authService.redirectToAuthUrl(res);
    });

    // Callback function to get Auth Token
    app.get('/oauth2/callback', (req, res) => {
        authService.doCallback(req, res);
    });

    // Get Logged In User Details
    app.get('/oauth2/whoami', (req, res) => {
        authService.getLoggedInUserDetails(req, res);
    });

    // Logout from Salesforce
    app.get('/oauth2/logout', (req, res) => {
        authService.doLogout(req, res);
    });

    // Get Conference-Session Details
    app.get('/api/conference-sessions/:id?', (req, res) => {
        integrationService.getConferenceSessionDetails(req, res);
    });
};
