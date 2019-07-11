const authService = require('./auth');
const jsforce = require('jsforce');

module.exports = {
    /**
     * Runs an SOQL query on Salesforce
     * @param {jsforce.Connection} conn - jsforce Connection
     * @param {string} soqlQuery - SOQL query
     * @returns {Array} Array of records returned by SOQL query
     */
    runSoql: (conn, soqlQuery) => {
        conn.query(soqlQuery, (error, result) => {
            if (error) {
                throw new Error(error);
            }
            return result.records;
        });
    },

    /**
     * Gets Conference Session records from Salesforce
     * @param {Object} req - server request
     * @param {Object} res - server response
     */
    getConferenceSessionDetails: (req, res) => {
        const session = authService.getSession(req, res);
        if (session === null) {
            return;
        }

        const conn = new jsforce.Connection({
            accessToken: session.sfdcAccessToken,
            instanceUrl: session.sfdcInstanceUrl
        });

        // Prepare query
        let soqlQuery =
            'SELECT Id, Name, Room__c, Description__c, Date_and_Time__c, (SELECT Speaker__r.First_Name__c, Speaker__r.Last_Name__c, Speaker__r.Bio__c, Speaker__r.Email__c FROM Session_Speakers__r) FROM Session__c';
        if (req.params.id) {
            soqlQuery += ` WHERE Id = '${req.params.id}' `;
        }

        // Execute query and respond with result or error
        try {
            const records = module.exports.runSoql(conn, soqlQuery);
            res.json(records);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};
