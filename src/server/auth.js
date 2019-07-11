const jsforce = require('jsforce');

module.exports = {

    /**
     *  Attemps to retrieves the server session.
     *  If there is no session, redirects with HTTP 401 and an error message
     *  @returns {Object}
     */
    getSession: (request, response) => {
        let _session = request.session;
        if (typeof _session.sfdcAccessToken === 'undefined') {
            response.status(401).send('Unauthorized');
            return null;
        }
        return _session;
    },

    /**
     *  Redirects user to Salesforce Login Page for authorization
     *  @returns {URL}
     */
    redirectToAuthUrl: (res, oauth2) => {
        res.redirect(oauth2.getAuthorizationUrl({ scope: 'api' }));
    },

    /**
     *  Gets Auth Token based on code from callback
     *  @returns {URL}
     */
    doCallback: (req, res, oauth2) => {
        if (!req.query.code) {
            res.status(500).send(
                'Failed to get authorization code from server callback.'
            );
            return;
        }
        const conn = new jsforce.Connection({ oauth2: oauth2 });
        const code = req.query.code;
        conn.authorize(code, (err, userInfo) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            req.session.sfdcAccessToken = conn.accessToken;
            req.session.sfdcInstanceUrl = conn.instanceUrl;
            res.redirect('/index.html');
        });
    },

    /**
     *  Gets Logged in user's details
     *  @returns {Object}
     */
    getLoggedInUserDetails: (req, res) => {
        const _session = module.exports.getSession(req, res);
        if (_session == null) return;

        const conn = new jsforce.Connection({
            instanceUrl: req.session.sfdcInstanceUrl,
            accessToken: req.session.sfdcAccessToken
        });
        conn.identity( (err, data) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(data);
        });
    },

    /**
     *  Destroys session and revokes Salesforce Auth Token
     *  @returns {URL}
     */
    doLogout: (req, res, oauth2) => {
        const _session = module.exports.getSession(req, res);
        if (_session == null) return;

        oauth2.revokeToken(req.session.sfdcAccessToken, (err) => {
            if (err) {
                res.status(500).json(err);
            }
        });
        req.session.destroy((error) => {
            if (error) {
                res.status(500).send(
                    'Force.com session destruction error: ' +
                    JSON.stringify(error)
                );
            }
        });
        res.redirect('/index.html');
    }
}