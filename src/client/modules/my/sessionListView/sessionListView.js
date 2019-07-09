import { LightningElement, track } from 'lwc';
import { getSessions } from 'data/sessionProvider';

export default class SessionListView extends LightningElement {
    @track sessions = getSessions(); // TODO: move this to parent

    handleSessionClick(event) {
        const sessionId = event.target.key;
        const navEvent = new CustomEvent('navigate', {
            detail: { view: 'sessionView', sessionId } // TODO: keep track of session id
        });
        this.dispatchEvent(navEvent);
    }
}
