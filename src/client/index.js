import { buildCustomElementConstructor } from 'lwc';
import MyApp from 'ui/app';

customElements.define('ui-app', buildCustomElementConstructor(MyApp));
