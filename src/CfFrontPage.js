
class CfFrontPage extends HTMLElement {

    constructor() {
        super();
        this.lastScrollPos = 0;
    }

    connectedCallback() {
        this.render();
        this.$addButton = byId('add-account-button');
        this.$accountsCon = this.querySelector('.accounts-con');
        this.$blockquote = this.querySelector('blockquote');
        this.populate();
        this.events();
    }

    populate() {
        this.updateTotalBalance(sumOfAccounts());
        this.updateAccountsTiles(APP_DATA['accounts']);
    }

    updateTotalBalance(total) {
        this.querySelector('h1').innerHTML = /*html*/ `
            <sup>Total Balance</sup>
            ₱${formatNumber(total)}
        `;
    }

    updateAccountsTiles(accounts) {
        if (!accounts.length) {
            this.querySelector('.accounts-con').innerHTML = /*html*/`<label class="empty">No accounts yet</label>`;
        }
        else {
            let tilesMarkUp = '';

            tilesMarkUp += accounts.filter(({exFromTotal }) => {
                if (exFromTotal) {
                    return false;
                }
                return true;
            }).map(({ iden, colorClass, emoji, name, transactions }) => {
                let balance = sumOfTransactions(transactions);
                //console.log(balance);
                return /*html*/`
                    <cf-account-tile 
                        iden="${iden}"
                        bg="${colorClass}"
                        emoji="${emoji}"
                        name="${name}"
                        balance="${balance}"
                        exfromtotal="0"
                    ></cf-account-tile>
                `;
            }).join('');

            tilesMarkUp += accounts.filter(({exFromTotal }) => {
                if (!exFromTotal) {
                    return false;
                }
                return true;
            }).map(({ iden, colorClass, emoji, name, transactions }) => {
                let balance = sumOfTransactions(transactions);
                //console.log(balance);
                return /*html*/`
                    <cf-account-tile 
                        iden="${iden}"
                        bg="${colorClass}"
                        emoji="${emoji}"
                        name="${name}"
                        balance="${balance}"
                        exfromtotal="1"
                    ></cf-account-tile>
                `;
            }).join('');

            this.querySelector('.accounts-con').innerHTML = tilesMarkUp;
        }
    }

    onPageShow(e) {
        this.populate();
    }

    onAddAccountClick(e) {
        e.preventDefault();
        routeTo('add-edit-account-page');
    }

    refresh() {
        this.populate();
    }

    events() {
        this.addEventListener('onPageShow', this.onPageShow.bind(this));
        this.$addButton.addEventListener('click', this.onAddAccountClick.bind(this));
        this.addEventListener('refresh', this.refresh.bind(this));
    }

    render() {
        
        this.innerHTML = /*html*/ `
            <div class="front-page-scroll-area-con">
                <div class="top-section no-select">
                    <button id="add-account-button" class="sml-shadow">Add Account</button>
                    <h1></h1>
                </div>   
                <div style="padding-bottom: 10rem;">
                    <div class="accounts-con"></div>
                    <blockquote>
                        "Spend less than you make."
                    </blockquote>
                </div>              
            </div>                  
        `;
    }

    disconnectedCallback() {
        this.removeEventListener('onPageShow', this.onPageShow);
        this.$addButton.removeEventListener('click', this.onAddAccountClick);
        this.removeEventListener('refresh', this.refresh.bind(this));
    }
}

customElements.define('cf-front-page', CfFrontPage);