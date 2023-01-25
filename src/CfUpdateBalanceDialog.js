

class CfUpdateBalanceDialog extends HTMLElement {
    constructor() {
        super();
        this.currentAccount = null;
    }

    connectedCallback() {
        this.render();
        this.$balanceInput = byId('update-balance__value');
        this.$accountNameLabel = byId('update-balance__account-name');
        this.$backDrop = this.querySelector('.dialog-backdrop');
        this.$dialog = byId('update-balance__dialog');
        this.$addButton = byId('update-balance__add');
        this.$subButton = byId('update-balance__sub');

        // (2021-11-12) rTODO: Add Notes field

        this.events();
    }

    onShow(e) {
        const { iden } = e.detail;
        //console.log(iden);
        this.currentAccount = appData.getAccountByIden(iden);
        this.$accountNameLabel.textContent = this.currentAccount.name;
        setTimeout(() => {
            this.$balanceInput.focus();
        }, 300);
        this.show();
    }

    onHide() {
        this.hide();
    }

    hide() {
        this.$backDrop.classList.add('hide');
        this.$dialog.classList.add('hide');
        this.currentAccount = null;
        this.$accountNameLabel.textContent = '';
        this.$balanceInput.value = '';
        window.scrollTo(0, 0);
    }

    show() {
        this.$backDrop.classList.remove('hide');
        this.$dialog.classList.remove('hide');
    }

    _getBalanceValue() {
        let val = pfloat(this.$balanceInput.value);
        if (val < 0) {
            // make into positive number
            val = val * -1;
        }
        return val;
    }

    save(data) {
        this.currentAccount.transactions.push(data);
        appData.updateAccount(this.currentAccount.iden, this.currentAccount);
        triggerEvent(document.querySelector('cf-front-page'), 'refresh');
        this.hide();
        window.scrollTo(0, 0);
    }

    onAdd() {
        // LM: 2022-04-08 15:34:24 [Confetti celebration!]
        requestAnimationFrame(() => {
            window.confetti({
                particleCount: 500,
                spread: 130
            })
        });
        if (this.$balanceInput.value.trim() === '') {
            this.hide();
            return;
        }
        let val = this._getBalanceValue();
        let accountName = this.currentAccount.name;
        this.save({
            iden: makeId('t'),
            timestamp: (new Date()).getTime(),
            amount: val,
            note: ''
        });
        
        notify(`Added <i class="account-detail__trans--income">${formatNumber(val)}</i> to ${accountName} account`, 3e3);
    }

    onSubtract() {
        if (this.$balanceInput.value.trim() === '') {
            this.hide();
            return;
        }
        let val = this._getBalanceValue();
        let accountName = this.currentAccount.name;
        this.save({
            iden: makeId('t'),
            timestamp: (new Date()).getTime(),
            amount: (val * -1),
            note: ''
        });
        notify(`Subtracted <i class="account-detail__trans--expense">-${formatNumber(val)}</i> from ${accountName} account`, 3e3);
    }

    events() {
        this.$backDrop.addEventListener('click', this.onHide.bind(this));
        this.addEventListener('show', this.onShow.bind(this));
        this.$addButton.addEventListener('click', this.onAdd.bind(this));
        this.$subButton.addEventListener('click', this.onSubtract.bind(this));
    }

    render() {
        this.innerHTML = /*html*/ `
            <div id="update-balance__dialog" class="blur sml-shadow hide dialog">
                <input type="number" inputmode="decimal" value="" placeholder="0.00" id="update-balance__value"/>
                <div id="update-balance__account-name">---</div>
                <div class="update-balance__buttoncon">
                    <button id="update-balance__add" class="abg-green">+</button>
                    <button id="update-balance__sub" class="abg-red">-</button>
                </div>
            </div>
            <div class="dialog-backdrop hide"></div>
        `;
    }

    disconnectedCallback() {
        this.$backDrop.removeEventListener('click', this.onHide.bind(this));
        this.removeEventListener('show', this.onShow.bind(this));
        this.$addButton.removeEventListener('click', this.onAdd.bind(this));
        this.$subButton.removeEventListener('click', this.onSubtract.bind(this));

    }
}

customElements.define('cf-update-balance-dialog', CfUpdateBalanceDialog);