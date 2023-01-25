

class CfColorPicker extends HTMLElement {
    constructor() {
        super();
        this.colors = [
            'abg-light-blue', 
            'abg-blue',
            'abg-green',
            'abg-yellow-green',
            'abg-orange',
            'abg-dark-orange',
            'abg-dark-purple',
            'abg-red',
            'abg-grey'
        ];
    }

    connectedCallback() {
        this.render();
        this.events();
    }

    removeAnySelected() {
        this.querySelectorAll('.add-edit-account__colorpicker-button').forEach((b) => {
            b.classList.remove('add-edit-account__colorpicker-button--selected');
        });
    }

    onColorClicked(e) {
        e.preventDefault();
        const $target = e.target;        
        if ($target?.classList.contains('add-edit-account__colorpicker-button')) {
            this.removeAnySelected();
            $target.classList.add('add-edit-account__colorpicker-button--selected');
            triggerEvent(this, 'onColorSelected', {
                colorClass: $target.getAttribute('data-color-class')
            });   
        }              
    }

    onReset() {
        this.removeAnySelected();
    }

    events() {
        this.addEventListener('click', this.onColorClicked.bind(this));
        this.addEventListener('reset', this.onReset.bind(this));
    }

    render() {
        this.innerHTML = /*html*/ `
            <div class="add-edit-account__colorpicker-con">
                ${this.colors.map((color) => /*html*/`<button class="add-edit-account__colorpicker-button ${color}" data-color-class="${color}"></button>`).join('')}
            </div>
        `;
    }

    disconnectedCallback() {
        this.addEventListener('click', this.onColorClicked.bind(this));
        this.removeEventListener('reset', this.onReset.bind(this));
    }
}

customElements.define('cf-colorpicker', CfColorPicker);