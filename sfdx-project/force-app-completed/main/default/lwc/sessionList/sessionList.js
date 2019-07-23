import { LightningElement, track } from 'lwc';
import getSessions from '@salesforce/apex/SessionController.getSessions';
import { NavigationMixin } from 'lightning/navigation';

export default class SessionList extends NavigationMixin(LightningElement) {
    allSessions = [];

    @track filteredSessions = [];
    @track sessionFilter = '';
    @track error;

    connectedCallback() {
        // Retrieve all sessions
        // In a prod environment, the operation should be paginated
        getSessions()
            .then(data => {
                // Reformat session date and time
                const formattedData = data.map(session => {
                    const time = session.Date_and_Time__c.substr(0, 16).replace(
                        'T',
                        ' '
                    );
                    // Clone session data because record object is immutable (we can't add or modify a property)
                    const formattedSession = {
                        Id: session.Id,
                        Name: session.Name,
                        Date_and_Time__c: time
                    };
                    return formattedSession;
                });
                // Save data
                this.allSessions = formattedData;
                this.filteredSessions = formattedData;
            })
            .catch(err => {
                this.error = err;
            });
    }

    handleSessionFilterInput(event) {
        // Perform a simple filter on local data
        // In a prod environment, the search should be done on the server side
        this.sessionFilter = event.target.value;
        if (this.sessionFilter === '') {
            this.filteredSessions = this.allSessions;
        } else {
            const filter = this.sessionFilter.toLowerCase();
            this.filteredSessions = this.allSessions.filter(
                session => session.Name.toLowerCase().indexOf(filter) !== -1
            );
        }
    }

    handleSessionClick(event) {
        const { sessionId } = event.target.dataset;
        // Navigate to session record page
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: sessionId,
                objectApiName: 'Session__c',
                actionName: 'view'
            }
        });
    }
}
