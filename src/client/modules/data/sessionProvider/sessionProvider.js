import { sessions } from 'data/sessions';

/**
 * Gets all sessions
 * @returns {Array}
 */
export function getSessions() {
    return sessions;
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
 * @returns {Object}
 */
export function getSession(sessionId) {
    const index = sessions.findIndex(session => session.Id === sessionId);
    if (index === -1) {
        throw new Error(`No session found with Id ${sessionId}`);
    }
    return sessions[index];
}
