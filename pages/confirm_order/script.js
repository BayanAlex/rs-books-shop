document.querySelectorAll('.delivery__info-input').forEach(input => input.addEventListener('blur', validateForm));

const form = document.forms[0];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;
form.date.setAttribute('value', tomorrowStr);
form.date.setAttribute('min', tomorrowStr);
form.gift1.onchange = form.gift2.onchange = (event) => {
    let gift = event.target;
    let anotherGift = event.target.name == 'gift1' ? document.querySelector('#gift2') : document.querySelector('#gift1');
    for(let i = 0; i < gift.options.length; i++)
        anotherGift.options[i].removeAttribute('disabled');
    if(gift.value != 'none') {
        anotherGift.options[gift.selectedIndex].setAttribute('disabled', 'true');
    }
}

form.onsubmit = submitOrder;

function submitOrder() {
    const customer = form.name.value + ' ' + form.surname.value;
    const deliveryDate = form.date.value.split('-').reverse().join('.');
    const deliveryAddress = form.street.value + ', house ' + form.house.value + ', flat ' + form.flat.value;
    const payment = form.payment.value;
    const gifts = form.gift1.value == 'none' && form.gift2.value == 'none' ? 'No gifts' : (form.gift1.options[form.gift1.selectedIndex].text + ', ' + form.gift2.options[form.gift2.selectedIndex].text).replace('None, ', '').replace(', None', ''); 
    setElementText('#customer', customer);
    setElementText('#date', deliveryDate);
    setElementText('#address', deliveryAddress);
    setElementText('#payment', payment);
    setElementText('#gifts', gifts);
    form.remove();
    document.querySelector('.order-created').style.display = 'block';
    localStorage.bag = '';
    return false;
}

function setElementText(element, text) {
    document.querySelector(element).textContent = text;
}

function validateForm(event) {
    const currentInput = event.currentTarget;
    const nameValid = inputValid('name', !(form.name.value.length < 4 || form.name.value.match(/[^A-Za-z]/)), 'The field is invalid (minimum 4 letters, no spaces)');
    const surnameValid = inputValid('surname', !(form.surname.value.length < 5 || form.surname.value.match(/[^A-Za-z]/)), 'The field is invalid (minimum 5 letters, no spaces)');
    const dateValid = inputValid('date', Date.parse(form.date.value) >= Date.parse(tomorrowStr), 'The field is invalid (not earlier than tomorrow)');
    const streetValid = inputValid('street', !(form.street.value.length < 5 || form.street.value.match(/[^A-Za-z0-9. ]/)), 'The field is invalid (minimum 5 letters/numbers)');
    const houseValid = inputValid('house', form.house.value.match(/^[1-9][0-9]*/), 'The field is invalid (positive numbers only)');
    const flatValid = inputValid('flat', form.flat.value.match(/^[1-9]((\-[1-9])?[0-9]*)*$/), 'The field is invalid (positive numbers and dash only)');
    const formValid = true && nameValid && surnameValid && dateValid && streetValid && houseValid && flatValid;
    if(formValid)
        form.submit.removeAttribute('disabled');
    else
        form.submit.setAttribute('disabled', '');

    function setInvalid(message) {
        if(!currentInput.classList.contains('invalid'))
        {
            currentInput.classList.add('invalid');
            let errorMsg = document.createElement('div');
            errorMsg.textContent = message;
            currentInput.after(errorMsg);
        }
    }

    function setValid() {
        if(currentInput.classList.contains('invalid')) {
            currentInput.nextElementSibling.remove();
            currentInput.classList.remove('invalid');
        }
    }

    function inputValid(fieldName, condition, message) {
        if(!condition) {
            if(currentInput.name == fieldName) 
                setInvalid(message);
            return false;
        }
        if(currentInput.name == fieldName)
            setValid();
        return true;
    }
}
