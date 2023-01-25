
class CfAccountTile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.$moreDetailsButton = this.querySelector('.account-item__details-button');
        this.$accountItemCon = this.querySelector('.account-item');
        this.$updateBalanceDialog = document.querySelector('cf-update-balance-dialog');
        this.$h3 = this.querySelector('h3');
        this.events();   
    }

    onMoreDetailsClicked(e) {
        routeTo('account-detail-page', {
            iden: this.iden
        }); 
    }

    onUpdateBalance() {
        triggerEvent(this.$updateBalanceDialog, 'show', {
            iden: this.iden
        });
    }

    events() {
        this.$moreDetailsButton.addEventListener('click', this.onMoreDetailsClicked.bind(this));
        this.$h3.addEventListener('click', this.onUpdateBalance.bind(this));
    }

    render() {
        this.iden = this.getAttribute('iden');
        const bg = this.getAttribute('bg');
        const emoji = this.getAttribute('emoji');
        const balance = this.getAttribute('balance');
        const name = this.getAttribute('name');
        const exFromTotal = pint(this.getAttribute('exfromtotal'));
        this.innerHTML = /*html*/`
            <div class="account-item no-select ${bg} ${(exFromTotal) ? 'account-item--excluded' : ''}" data-iden="${this.iden}">
                <div class="account-item__emoji ">${emoji}</div>
                <div class="account-item__details-button">...</div>
                <h3>
                    ₱${formatNumber(balance)}
                    <sub>${name}</sub>
                </h3>
            </div>
        `;
    }

    diconnectedCallback() {
        this.$moreDetailsButton.removeEventListener('click', this.onMoreDetailsClicked.bind(this));
        this.$h3.removeEventListener('click', this.onUpdateBalance.bind(this));
    }
}
customElements.define('cf-account-tile', CfAccountTile);