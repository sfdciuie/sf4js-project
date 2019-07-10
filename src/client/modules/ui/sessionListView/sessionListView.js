import { LightningElement, track } from 'lwc';
import { getSessions } from 'data/sessionProvider';
import { navigate, SESSION_VIEW } from 'ui/navigationUtil';

export default class SessionListView extends LightningElement {
    @track sessions = getSessions();

    handleSessionClick(event) {
        const { sessionId } = event.target.dataset;
        navigate(this, SESSION_VIEW, { sessionId });
    }
}
