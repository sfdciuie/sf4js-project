export const LOGIN_VIEW = 'loginView';
export const SESSION_LIST_VIEW = 'sessionListView';
export const SESSION_VIEW = 'sessionView';

export const VIEWS = [LOGIN_VIEW, SESSION_LIST_VIEW, SESSION_VIEW];

/**
 * Fires the navigate event
 * @param {LightningElement} component - the source component
 * @param {string} viewName - name of target view, one of VIEWS
 * @param {any} viewParams - optional view params
 */
export function navigate(component, viewName, viewParams) {
    if (!VIEWS.some(view => view === viewName)) {
        throw new Error(`Unknown view ${viewName}`);
    }
    const navEvent = new CustomEvent('navigate', {
        detail: {
            view: { name: viewName, params: viewParams }
        }
    });
    component.dispatchEvent(navEvent);
}
