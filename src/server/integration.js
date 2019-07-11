var authTools = require("./auth");
const jsforce = require('jsforce');

module.exports = {
    /**
     *  Runs an SOQL query on Salesforce
     *  @returns {Array}
     */
    runSoql: (req, res, soqlQuery) => {
        const conn = new jsforce.Connection({
            instanceUrl: req.session.sfdcInstanceUrl,
            accessToken: req.session.sfdcAccessToken
        });
        conn.query(soqlQuery, function (err, result) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(result.records);
        });
    },

    /**
     *  Gets Conference Session records from Salesforce
     *  @returns {Array}
     */
    getConferenceSessionDetails: (req, res) => {
        const _session = authTools.getSession(req, res);
        if (_session == null) return;

        let soqlQuery =
            'SELECT Id, Name, Room__c, Description__c, Date_and_Time__c, (select Speaker__r.First_Name__c, Speaker__r.Last_Name__c, Speaker__r.Bio__c, Speaker__r.Email__c from Session_Speakers__r) FROM Session__c';
        if (req.params.conferencesessionid) {
            soqlQuery += ` where Id = '${req.params.conferencesessionid}' `;
        }

        module.exports.runSoql(req, res, soqlQuery);
    }
}
