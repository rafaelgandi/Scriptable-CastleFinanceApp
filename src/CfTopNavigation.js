
class CfTopNavigation extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.events();
    }

    onButtonsClicked(e) {
        const $target = e.target;
        if ($target?.classList.contains('top-navigation__back-button')) {
            routeTo('front-page');
            return;
        }
        else if ($target?.classList.contains('top-navigation__menu-button')) {
            triggerEvent(this, 'menuClick');
            return;
        }
    }

    events() {
        this.addEventListener('click', this.onButtonsClicked.bind(this));
    }

    render() {
        const pageShown = this.getAttribute('onpage');
        let menuLabel = '';
        if (pageShown === 'account-detail-page') {
            menuLabel = 'Edit';
        }
        // ... add more menu labels here per page.
        this.innerHTML = /*html*/ `
            <nav class="top-navigation">
                <div>
                    <button class="top-navigation__back-button"></button>
                </div>
                <div>
                    <button class="top-navigation__menu-button">${menuLabel}</button>
                </div>
            </nav>
        `;
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.onButtonsClicked.bind(this));
    }
}

customElements.define('cf-top-navigation', CfTopNavigation);