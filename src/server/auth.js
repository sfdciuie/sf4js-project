const jsforce = require('jsforce');

module.exports = {
    /**
     * Attemps to retrieves the server session.
     * If there is no session, redirects with HTTP 401 and an error message.
     * @param {Object} req - server request
     * @param {Object} res - server response
     * @returns {Object} session data or null if there was no session
     */
    getSession: (req, res) => {
        const { session } = req;
        if (session.sfdcAccessToken === undefined) {
            res.status(401).send('Unauthorized');
            return null;
        }
        return session;
    },

    /**
     * Redirects user to Salesforce login page for authorization
     * @param {Object} req - server request
     * @param {jsforce.OAuth2} oauth2 - OAuth2 configuration
     */
    redirectToAuthUrl: (res, oauth2) => {
        res.redirect(oauth2.getAuthorizationUrl({ scope: 'api' }));
    },

    /**
     * Retrieves and stores OAuth2 token from authentication callback
     * @param {Object} req - server request
     * @param {Object} res - server response
     * @param {jsforce.OAuth2} oauth2 - OAuth2 configuration
     */
    doCallback: (req, res, oauth2) => {
        if (!req.query.code) {
            res.status(500).send(
                'Failed to get authorization code from server callback.'
            );
            return;
        }
        const conn = new jsforce.Connection({ oauth2 });
        const { code } = req.query;
        conn.authorize(code, error => {
            if (error) {
                res.status(500).send(error);
                return;
            }
            req.session.sfdcAccessToken = conn.accessToken;
            req.session.sfdcInstanceUrl = conn.instanceUrl;
            res.redirect('/index.html');
        });
    },

    /**
     * Gets logged in user's details
     * @param {Object} req - server request
     * @param {Object} res - server response
     * @returns {Object} user info
     */
    getLoggedInUserDetails: (req, res) => {
        const session = module.exports.getSession(req, res);
        if (session === null) {
            return;
        }

        const conn = new jsforce.Connection({
            accessToken: session.sfdcAccessToken,
            instanceUrl: session.sfdcInstanceUrl
        });
        conn.identity((error, data) => {
            if (error) {
                res.status(500).send(error);
                return;
            }
            res.json(data);
        });
    },

    /**
     * Destroys session and revokes Salesforce OAuth2 token
     * @param {Object} req - server request
     * @param {Object} res - server response
     * @param {jsforce.OAuth2} oauth2 - OAuth2 configuration
     */
    doLogout: (req, res, oauth2) => {
        const session = module.exports.getSession(req, res);
        if (session === null) {
            return;
        }

        oauth2.revokeToken(session.sfdcAccessToken, error => {
            if (error) {
                res.status(500).json(error);
            }
        });
        session.destroy(error => {
            if (error) {
                res.status(500).send(
                    'Force.com session destruction error: ' +
                        JSON.stringify(error)
                );
            }
        });
        res.redirect('/index.html');
    }
};
