import { LightningElement, track } from 'lwc';
import { VIEWS, LOGIN_VIEW, SESSION_LIST_VIEW, SESSION_VIEW } from 'my/navigationUtil';

export default class App extends LightningElement {
    @track isLogged = false;
    @track view = LOGIN_VIEW;

    handleLogin() {
        // TODO: trigger OAuth flow here
        this.view = SESSION_LIST_VIEW;
    }

    handleNavigate(event) {
        const targetView = event.detail.view;
        if (VIEWS.some(view => view === targetView)) {
            this.view = targetView;
        } else {
            throw new Error('Unknown view: '+ targetView);
        }
    }

    get isLoginView() {
        return this.view === LOGIN_VIEW;
    }

    get isSessionListView() {
        return this.view === SESSION_LIST_VIEW;
    }

    get isSessionView() {
        return this.view === SESSION_VIEW;
    }
}
