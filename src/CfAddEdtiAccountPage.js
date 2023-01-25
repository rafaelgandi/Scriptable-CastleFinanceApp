

class CfAddEditAccountPage extends HTMLElement {
    constructor() {
        super();
        this.accountDetails = null;
    }

    connectedCallback() {
        this.render();
        this.$colorPicker = this.querySelector('cf-colorpicker');
        this.$accountName = this.querySelector('.add-edit-account__name');
        this.$accountDesc = this.querySelector('.add-edit-account__desc');
        this.$accountEmoji = this.querySelector('.add-edit-account__emoji');
        this.$balance = this.querySelector('.add-edit-account__init-balance');
        this.$exFromTotal = this.querySelector('.add-edit-account__ex-from-total');
        this.$saveButton = this.querySelector('.add-edit-account__save-button');
        this.$deleteButton = this.querySelector('.add-edit-account__delete-button');
        this.selectedColorClass = null;
        this.events();
        
    }

    reset() {
        this.accountDetails = null;
        this.$accountName.value = '';
        this.$accountDesc.value = '';
        this.$accountEmoji.value = '';
        this.$balance.value = '';
        this.$exFromTotal.checked = false;
        this.$balance.parentNode.classList.remove('hide');
        this.selectedColorClass = null;
        this.$saveButton.textContent = 'Done';
        this.$deleteButton.parentNode.classList.add('hide');
        triggerEvent(this.$colorPicker, 'reset');
    }

    populate() {
        this.$accountName.value = this.accountDetails.name;
        this.$accountDesc.value = this.accountDetails.desc;
        this.$accountEmoji.value = this.accountDetails.emoji;
        this.$balance.value = '';
        this.$exFromTotal.checked = !!this.accountDetails.exFromTotal;
        this.$balance.parentNode.classList.add('hide');
        this.selectedColorClass = this.accountDetails.colorClass;
        this.$saveButton.textContent = 'Update';
        this.$deleteButton.parentNode.classList.remove('hide');
        this.$colorPicker
            .querySelector(`button[data-color-class="${this.accountDetails.colorClass}"]`)
            ?.click();
    }

    onPageShow(e) {
        this.reset();
        if (e?.detail) {
            this.accountDetails = e.detail;
            this.populate();
        }
    }

    onColorSelected(e) {
        this.selectedColorClass = e.detail.colorClass;
    }

    validate() {
        let name = this.$accountName.value,
            emoji = this.$accountEmoji.value,
            colorClass = this.selectedColorClass; 
        if (name.trim() === '' || emoji.trim() === '' || !colorClass) {
            return false;
        }
        return true;
    }

    onDelete(e) {
        doConfirm('Delete Account', () => {
            //console.log(this.accountDetails);
            appData.deleteAccount(this.accountDetails.iden);
            routeTo('front-page');
        });
    }

    onSave(e) {
        e.preventDefault();
        let name = this.$accountName.value,
            desc = this.$accountDesc.value,
            emoji = this.$accountEmoji.value,
            initialBalance = this.$balance.value,
            exFromTotal = this.$exFromTotal.checked,
            colorClass = this.selectedColorClass;    
        if (!this.validate()) {
            notify('Some required information are missing.');
            return;
        }
        if (this.accountDetails === null) {
            appData.addAccount({
                iden: makeId('a'),
                name,
                desc,
                emoji, 
                colorClass,
                exFromTotal,
                transactions: [
                    {
                        iden: makeId('t'),
                        timestamp: (new Date()).getTime(),
                        amount: pfloat(initialBalance),
                        note: 'Initial balance'
                    }
                ]
            });
        }
        else {
            appData.updateAccount(this.accountDetails.iden, {
                iden: this.accountDetails.iden,
                name,
                desc,
                emoji, 
                colorClass,
                exFromTotal,
                transactions: this.accountDetails.transactions
            });
        }
        this.reset();
        routeTo('front-page');
    }

    events() {
        this.addEventListener('onPageShow', this.onPageShow.bind(this));
        this.$colorPicker.addEventListener('onColorSelected', this.onColorSelected.bind(this));
        this.$saveButton.addEventListener('click', this.onSave.bind(this));
        this.$deleteButton.addEventListener('click', this.onDelete.bind(this));
    }   

    render() {
        this.innerHTML = /*html*/ `
            <cf-top-navigation onpage="add-edit-account-page"></cf-top-navigation>
            <div class="add-edit-account__itemcon">
                <label>Name</label>
                <input type="text" class="add-edit-account__name" />
            </div>
            <div class="add-edit-account__itemcon">
                <label>Description</label>
                <input type="text" class="add-edit-account__desc" />
            </div>
            <div class="add-edit-account__itemcon">
                <label>Emoji</label>
                <input type="text" class="add-edit-account__emoji" maxlength="5"/>
            </div>
            <div class="add-edit-account__itemcon">
                <label>Initial Balance</label>
                <input type="number" inputmode="decimal" class="add-edit-account__init-balance" />
            </div>
            <div class="add-edit-account__itemcon">
                <label>Color</label>
                <cf-colorpicker></cf-colorpicker>
            </div>
            <div class="add-edit-account__itemcon">
                <label>
                    <input type="checkbox" class="add-edit-account__ex-from-total" />
                    Exclude From Total 
                </label>
            </div>
            <div class="add-edit-account__itemcon"> 
                <button class="add-edit-account__save-button">Done</button>
            </div>
            <div class="add-edit-account__itemcon hide"> 
                <button class="add-edit-account__delete-button">Delete Account</button>
            </div>
        `;
    }

    disconnectedCallback() {
        this.removeEventListener('onPageShow', this.onPageShow);
        this.$colorPicker.removeEventListener('onColorSelected', this.onColorSelected);
        this.$saveButton.removeEventListener('click', this.onSave);
        this.$deleteButton.removeEventListener('click', this.onDelete.bind(this));
    }
}
customElements.define('cf-add-edit-account-page', CfAddEditAccountPage);