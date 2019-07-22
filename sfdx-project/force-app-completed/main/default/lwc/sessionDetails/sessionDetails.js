import { LightningElement, track, api, wire } from 'lwc';
import getSessionWithSpeakers from '@salesforce/apex/SessionController.getSessionWithSpeakers';

export default class SessionDetails extends LightningElement {
    @api recordId;

    @wire(getSessionWithSpeakers, { sessionId: '$recordId' })
    session;

    get sessionTime() {
        if (this.session.data) {
            return this.session.data.Date_and_Time__c.substr(0, 16).replace(
                'T',
                ' '
            );
        }
        return '';
    }
}
