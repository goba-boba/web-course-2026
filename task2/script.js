// находим форму и блок с сообщением по id
const form = document.getElementById('booking-form');
const successMsg = document.getElementById('form-success');

// вешаем обработчик на отправку формы
form.addEventListener('submit', (e) => {
    // отменяем стандартное поведение - страница не перезагрузится
    e.preventDefault();

    // берём значения из полей и убираем пробелы по краям
    const name = form.querySelector('input[name="name"]').value.trim();
    const phone = form.querySelector('input[name="phone"]').value.trim();

    // если имя или телефон пустые или только пробелы  ругаемся и выходим
    if (!name || !phone) {
        alert('Пожалуйста, заполните имя и телефон');
        return;
    }

    // всё ок - добавляем класс visible css делает сообщение видимым
    successMsg.classList.add('visible');

    // очищаем форму
    form.reset();

    // через 5 секунд сообщение уходиит
    setTimeout(() => {
        successMsg.classList.remove('visible');
    }, 5000);
});
