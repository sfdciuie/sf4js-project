import { LightningElement, track } from 'lwc';
import {
    VIEWS,
    LOGIN_VIEW,
    SESSION_LIST_VIEW,
    SESSION_VIEW
} from 'ui/navigationUtil';
import { getLoggedInUser } from 'client/authProvider';

export default class App extends LightningElement {
    @track loggedUser = undefined;
    @track view = { name: LOGIN_VIEW };

    connectedCallback() {
        getLoggedInUser().then(response => {
            if (response.user_id === undefined) {
                this.loggedUser = undefined;
                this.view = { name: LOGIN_VIEW };
            } else {
                this.loggedUser = response;
                this.view = { name: SESSION_LIST_VIEW };
            }
        });
    }

    handleLogout() {
        // TODO: trigger OAuth logout flow here
        this.view = { name: LOGIN_VIEW };
        this.loggedUser = undefined;
    }

    handleNavigate(event) {
        const targetView = event.detail.view;
        if (VIEWS.some(viewName => viewName === targetView.name)) {
            this.view = targetView;
        } else {
            throw new Error(`Unknown view ${targetView.name}`);
        }
    }

    get isLoginView() {
        return this.view.name === LOGIN_VIEW;
    }

    get isSessionListView() {
        return this.view.name === SESSION_LIST_VIEW;
    }

    get isSessionView() {
        return this.view.name === SESSION_VIEW;
    }
}
