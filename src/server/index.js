/* eslint-disable no-console */

module.exports = app => {
    require('dotenv').config();

    const jsforce = require('jsforce');
    const session = require('express-session');

    //Retrieve OAuth Information from .env file
    const clientId = process.env.CLIENT_ID || null;
    const clientSecret = process.env.CLIENT_SECRET || null;
    const redirectUri = process.env.REDIRECT_URL || null;

    const oauth2 = new jsforce.OAuth2({
        clientId,
        clientSecret,
        redirectUri
    });

    // Enable server-side sessions
    app.use(
        session({
            secret: process.env.sessionSecretKey,
            cookie: { secure: 'auto' },
            resave: false,
            saveUninitialized: false
        })
    );

    /**
     *  Attemps to retrieves the server session.
     *  If there is no session, redirects with HTTP 401 and an error message
     */
    function getSession(request, response) {
        let _session = request.session;
        if (typeof _session.sfdcAccessToken === 'undefined') {
            response.status(401).send('Unauthorized');
            return null;
        }
        return _session;
    }

    //Login to Salesforce
    app.get('/oauth2/login', function(req, res) {
        if (clientId && clientSecret && redirectUri) {
            res.redirect(oauth2.getAuthorizationUrl({ scope: 'api' }));
        } else {
            res.status(500).send('Configuration Missing');
        }
    });

    //Callback function to get Auth Token
    app.get('/oauth2/callback', function(req, res) {
        if (!req.query.code) {
            res.status(500).send(
                'Failed to get authorization code from server callback.'
            );
            return;
        }
        const conn = new jsforce.Connection({ oauth2: oauth2 });
        const code = req.query.code;
        conn.authorize(code, function(err, userInfo) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            req.session.sfdcAccessToken = conn.accessToken;
            req.session.sfdcInstanceUrl = conn.instanceUrl;
            res.redirect('/index.html');
        });
    });

    //Get Logged In User Details
    app.get('/oauth2/whoami', function(req, res) {
        const _session = getSession(req, res);
        if (_session == null) return;

        const conn = new jsforce.Connection({
            instanceUrl: req.session.sfdcInstanceUrl,
            accessToken: req.session.sfdcAccessToken
        });

        conn.identity(function(err, data) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(data);
        });
    });

    //Logout from Salesforce
    app.get('/oauth2/logout', function(req, res) {
        const _session = getSession(req, res);
        if (_session == null) return;

        oauth2.revokeToken(req.session.sfdcAccessToken, function(err) {
            if (err) {
                res.status(500).json(err);
            }
        });
        req.session.destroy(function(error) {
            if (error) {
                console.error(
                    'Force.com session destruction error: ' +
                        JSON.stringify(error)
                );
            }
        });

        res.redirect('/index.html');
    });

    //Get Conference-Session Details
    app.get('/api/conference-sessions/:conferencesessionid?', function(
        req,
        res
    ) {
        const _session = getSession(req, res);
        if (_session == null) return;

        const conn = new jsforce.Connection({
            instanceUrl: req.session.sfdcInstanceUrl,
            accessToken: req.session.sfdcAccessToken
        });

        let soqlQuery =
            'SELECT Id, Name, Room__c, Description__c, Date_and_Time__c, (select Speaker__r.First_Name__c, Speaker__r.Last_Name__c, Speaker__r.Bio__c, Speaker__r.Email__c from Session_Speakers__r) FROM Session__c';
        if (req.params.conferencesessionid) {
            soqlQuery += ` where Id = '${req.params.conferencesessionid}' `;
        }

        conn.query(soqlQuery, function(err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(result.records);
        });
    });
};
