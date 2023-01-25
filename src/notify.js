

const $notification = document.createElement('div');
$notification.id = 'notification';
$notification.className = 'blur sml-shadow hide';
document.body.append($notification);

const notify = (() => {
    let timer = null;
    const $n = byId('notification');
    function hide() {
        clearTimeout(timer);
        $n.classList.add('hide');
        $n.innerHTML = '';
    }
    $n.addEventListener('click', () => {
        hide();
    });
    return (msg, duration = 5e3) => {
        clearTimeout(timer);
        $n.innerHTML = msg;
        $n.classList.remove('hide');
        timer = setTimeout(() => {
            hide();
        }, duration);
    };
})();