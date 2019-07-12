import { sessions } from './sessions';

/**
 * Gets all sessions
 * @returns {Promise<Array>} Promise holding an Arrray of records
 */
export function getSessions() {
    return new Promise(function(resolve, reject) {
        fetch('/api/conference-sessions/')
            .then(response => {
                // fetch isn't throwing an error if the request fails.
                // Therefore we have to check the ok property.
                if (!response.ok) {
                    reject(response);
                }
                return response.json();
            })
            .then(jsonResponse => {
                resolve(jsonResponse);
            })
            .catch(error => {
                reject(error);
            });
    });

    //Comment above code and uncomment below line to return static data
    //return sessions;
}

/**
 * Gets sessions with names containing a search key
 * @param {string} searchKey
 * @returns {Array}
 */
export function findSession(searchKey) {
    if (searchKey.trim().length === 0) {
        return [];
    }
    const results = sessions.filter(
        item => item.Name.toLowerCase().indexOf(searchKey) !== -1
    );
    return results;
}

/**
 * Gets a session record
 * @param {string} sessionId
 * @returns {Promise} Promise holding a session record
 */
export function getSession(sessionId) {
    return new Promise(function(resolve, reject) {
        fetch(`/api/conference-sessions/${sessionId}`)
            .then(response => {
                // fetch isn't throwing an error if the request fails.
                // Therefore we have to check the ok property.
                if (!response.ok) {
                    reject(response);
                }
                return response.json();
            })
            .then(jsonResponse => {
                resolve(jsonResponse);
            })
            .catch(error => {
                reject(error);
            });
    });
    /* const index = sessions.findIndex(session => session.Id === sessionId);
    if (index === -1) {
        throw new Error(`No session found with Id ${sessionId}`);
    }
    return sessions[index];*/
}
