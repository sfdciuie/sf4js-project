import { LightningElement, api } from 'lwc';

export default class Header extends LightningElement {
    @api loggedUser;

    handleLogout() {
        this.dispatchEvent(new CustomEvent('logout'));
    }
}
