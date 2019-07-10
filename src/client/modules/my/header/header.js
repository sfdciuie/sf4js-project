import { LightningElement, api } from 'lwc';

export default class Header extends LightningElement {
    @api isUserLoggedIn;

    handleLogout() {
        this.dispatchEvent(new CustomEvent('logout'));
    }
}
