const form = document.getElementById('booking-form');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();

    if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return;
    }

    successMsg.classList.add('visible');
    form.reset();

    setTimeout(() => {
        successMsg.classList.remove('visible');
    }, 5000);
});