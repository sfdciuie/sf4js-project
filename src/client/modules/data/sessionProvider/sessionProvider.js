import { sessions } from 'data/sessions';

export function findSession(searchKey) {
    if (searchKey.length === 0) return;
    const results = sessions.filter(
        item => item.Name.toLowerCase().indexOf(searchKey) !== -1
    );
    // eslint-disable-next-line consistent-return
    return results;
}

export function getSessions() {
    return sessions;
}
