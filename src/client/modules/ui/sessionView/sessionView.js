import { LightningElement, track, api } from 'lwc';
import { getSession } from 'client/sessionProvider';
//import { getSessionSpeakers } from 'client/speakerProvider';
import { navigate, SESSION_LIST_VIEW } from 'ui/navigationUtil';

export default class SessionView extends LightningElement {
    @track session;
    @track speakers = [];
    @track error;

    set sessionId(sessionId) {
        getSession(sessionId)
            .then(data => {
                if (data.length > 0) {
                    const session = data[0];
                    const time = session.Date_and_Time__c.substr(0, 16).replace(
                        'T',
                        ' '
                    );
                    session.Date_and_Time__c = time;
                    this.session = session;
                    this.speakers = this.session.Session_Speakers__r.records;
                }
            })
            .catch(err => {
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
