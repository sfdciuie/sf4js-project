import { sessions } from 'data/sessions';

export function findSession(searchKey) {
    if (searchKey.trim().length === 0) {
        return [];
    }
    const results = sessions.filter(
        item => item.Name.toLowerCase().indexOf(searchKey) !== -1
    );
    // eslint-disable-next-line consistent-return
    return results;
}

export function getSessions() {
    return sessions;
}

export function getSession(sessionId) {
    const index = sessions.findIndex(session => session.Id === sessionId);
    if (index === -1) {
        throw new Error(`No session found with Id ${sessionId}`);
    }
    return sessions[index];
}
