class CfAccountDetailPage extends HTMLElement {
    constructor() {
        super();
        this.accountDetails = null;
    }

    connectedCallback() {
        this.render();
        this.events();
    }

    onPageShow(e) {
        let accountId = e.detail.iden;
        this.accountDetails = getAccountByIden(accountId);
        // console.log(this.accountDetails);
        this.populate();
        this.$topNav?.removeEventListener('menuClick', this.onEditClicked.bind(this));
        this.$topNav = this.querySelector('cf-top-navigation');
        this.$topNav.addEventListener('menuClick', this.onEditClicked.bind(this));
    }

    renderTransactions(transactions) {
        if (!transactions.length) {
            return /*html*/ `<label class="empty">No transactions yet</label>`;
        }
        else {
            return /*html*/ `
                <table class="account-detail__trans-table">
                    <thead>
                        <th colspan="2" style="width:68%;text-align:left;">Transaction Date</th>
                        <th style="width:20%;text-align:right;">Amount</th>
                    </thead>
                    <tbody>
                        ${transactions.map((t) => {
                            const fontClass = (t.amount < 0) ? 'account-detail__trans--expense' : 'account-detail__trans--income';
                            return /*html*/ `
                                <tr>
                                    <td class="account-detail__trans-delete" data-transiden="${t.iden}">🗑</td>
                                    <td class="account-detail__trans-date">
                                        ${formatDate(t.timestamp)}
                                        ${('note' in t && t.note.trim() !== '') ? `<sub>${t.note}</sub>` : ''}
                                    </td>
                                    <td class="account-detail__trans-amount ${fontClass}">${formatNumber(t.amount)}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }
    }

    populate() {
        const bg = this.accountDetails.colorClass;
        const emoji = this.accountDetails.emoji;
        const balance = sumOfTransactions(this.accountDetails.transactions);
        const name = this.accountDetails.name;
        const desc = ('desc' in this.accountDetails && this.accountDetails.desc.trim() !== '') ? this.accountDetails.desc : '';

        this.innerHTML = /*html*/ `
            <cf-top-navigation onpage="account-detail-page"></cf-top-navigation>
            <div class="account-detail__top-card ${bg}">
                <h2>
                    <sup><b>${emoji}</b> ${name}</sup>
                    <span>₱${formatNumber(balance)}</span>
                    <sub>${desc}</sub>
                </h2>
            </div>
            <div class="account-detail__trans-con">
                ${ this.renderTransactions(this.accountDetails.transactions) }
            </div>
        `;
    }

    onDeleteTransaction(e) {
        const $me = e.target;
        if ($me?.classList.contains('account-detail__trans-delete')) {
            doConfirm('Delete Transaction',  () => {
                const transIden = $me.getAttribute('data-transiden');
                this.accountDetails = appData.deleteTransaction(this.accountDetails.iden, transIden);
                this.querySelector('.account-detail__trans-con').innerHTML = this.renderTransactions(this.accountDetails.transactions);
                const balance = sumOfTransactions(this.accountDetails.transactions);
                this.querySelector('h2 span').textContent = `₱${formatNumber(balance)}`;
            });           
        }
        
    }

    onEditClicked() {
        //console.log(this.accountDetails);
        routeTo('add-edit-account-page', this.accountDetails);
    }

    events() { 
        this.addEventListener('onPageShow', this.onPageShow.bind(this));
        this.addEventListener('click', this.onDeleteTransaction.bind(this));
    }

    render() {
        this.innerHTML = /*html*/ `
            <label class="empty">Loading...</label> 
        `;
    }

    disconnectedCallback() {
        this.removeEventListener('onPageShow', this.onPageShow.bind(this));
        this.removeEventListener('click', this.onDeleteTransaction.bind(this));
    }
}

customElements.define('cf-account-detail-page', CfAccountDetailPage);

