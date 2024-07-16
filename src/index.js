function luhnCheck(input) {
    const number = input.toString();
    const digits = number.replace(/\D/g, '').split('').map(Number);
    let sum = 0;
    let isSecond = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];
        if (isSecond) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        sum += digit;
        isSecond = !isSecond;
    }
    return sum % 10 === 0;
}

function getPaymentSystem(number) {
    const visaStartsWith = /^4/;
    const mastercardStartsWith = /^(?:5[1-5]|22[1-2])/;
    const amexStartsWith = /^(?:34|37)/;
    const discoverStartsWith = /^(?:6011)/;
    const jcbStartsWith = /^(?:35)/;
    const mirStartsWith = /^(?:220|300)/;
    const elementsCards = document.querySelectorAll('.card');
    elementsCards.forEach((item) => { item.classList.add('cdisabled'); });
    if (visaStartsWith.test(number)) {
        document.querySelector('.card.visa').classList.remove('cdisabled');
        return 'Visa';
    }
    if (mastercardStartsWith.test(number)) {
        document.querySelector('.card.master').classList.remove('cdisabled');
        return 'MasterCard';
    }
    if (amexStartsWith.test(number)) {
        document.querySelector('.card.amex').classList.remove('cdisabled');
        return 'American Express';
    }
    if (discoverStartsWith.test(number)) {
        document.querySelector('.card.discover').classList.remove('cdisabled');
        return 'Discover';
    }
    if (jcbStartsWith.test(number)) {
        document.querySelector('.card.jcb').classList.remove('cdisabled');
        return 'JCB';
    }
    if (mirStartsWith.test(number)) {
        document.querySelector('.card.mir').classList.remove('cdisabled');
        return 'Мир';
    }

    return 'Система карты не опознана!';
}

function validateCard() {
    const cardNumberInput = document.getElementById('cardNumber');
    const resultDiv = document.querySelector('.result');
    const number = cardNumberInput.value.trim();
    if (!number) {
        alert('Пожалуйста, введите номер карты.');
        return;
    }
    const isValid = luhnCheck(number);
    const paymentSystem = getPaymentSystem(number);
    resultDiv.innerHTML = `<p>${isValid ? 'Номер карты действителен.' : 'Номер карты недействителен.'}</p>`;
    resultDiv.innerHTML += `<p>Система: ${paymentSystem || 'Неизвестно'}</p>`;
}

const checkButton = document.querySelector('.checkerButton');
checkButton.addEventListener('click', validateCard);
