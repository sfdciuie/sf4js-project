import { speakers } from 'data/speakers';

/**
 * Gets all speakers
 * @returns {Array}
 */
export function getSpeakers() {
    return speakers;
}

/**
 * Gets session's speakers
 * @param {string} sessionId
 * @returns {Array}
 */
// eslint-disable-next-line no-unused-vars
export function getSessionSpeakers(sessionId) {
    return [speakers[0], speakers[1]];
}

/**
 * Gets a speakers record
 * @param {string} speakerId
 * @returns {Object}
 */
export function getSpeaker(speakerId) {
    const index = speakers.findIndex(speaker => speaker.Id === speakerId);
    if (index === -1) {
        throw new Error(`No speaker found with Id ${speakerId}`);
    }
    return speakers[index];
}
