import { LightningElement, track, api } from 'lwc';
import { getSession } from 'data/sessionProvider';
import { navigate, SESSION_LIST_VIEW } from 'ui/navigationUtil';

export default class SessionView extends LightningElement {
    @track session;
    @track speakers = [];

    set sessionId(id) {
        this.session = getSession(id);
    }

    @api
    get sessionId() {
        return this.session.Id;
    }

    handleBack() {
        navigate(this, SESSION_LIST_VIEW);
    }
}
