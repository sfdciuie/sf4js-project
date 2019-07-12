import { LightningElement, track, api } from 'lwc';
import { getSession } from 'data/sessionProvider';
//import { getSessionSpeakers } from 'data/speakerProvider';
import { navigate, SESSION_LIST_VIEW } from 'ui/navigationUtil';

export default class SessionView extends LightningElement {
    @track session;
    @track speakers = [];
    @track error;

    set sessionId(sessionId) {
        getSession(sessionId).then((data) => {
            if(data.length > 0){
                this.session = data[0];
            }
            this.speakers = this.session.Session_Speakers__r.records;
        }).catch((err) => {
            this.error = err;
        });
        //this.session = getSession(sessionId);
        //this.speakers = getSessionSpeakers(sessionId);
    }

    @api
    get sessionId() {
        return this.session.Id;
    }

    handleBack() {
        navigate(this, SESSION_LIST_VIEW);
    }
}
