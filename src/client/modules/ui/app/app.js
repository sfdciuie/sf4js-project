import { LightningElement, track } from 'lwc';
import {
    VIEWS,
    LOGIN_VIEW,
    SESSION_LIST_VIEW,
    SESSION_VIEW
} from 'ui/navigationUtil';

export default class App extends LightningElement {
    @track isUserLoggedIn = true;
    @track view = { name: SESSION_VIEW, params: { sessionId: '1' } };

    handleLogin() {
        // TODO: trigger OAuth login flow here
        this.view = { name: SESSION_LIST_VIEW };
        this.isUserLoggedIn = true;
    }

    handleLogout() {
        // TODO: trigger OAuth logout flow here
        this.view = { name: LOGIN_VIEW };
        this.isUserLoggedIn = false;
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
