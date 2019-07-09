import { LightningElement } from 'lwc';

export default class LoginView extends LightningElement {
    handleLogin() {
        this.dispatchEvent(new CustomEvent('login'));
    }
}
