//____________________________________________________________
// The journey of thousand miles start with a single step
//____________________________________________________________


//____________________________________________________________
// VALIDATIONS
//____________________________________________________________

const validations = {
    bill: (bill) => isNumber(bill, 'bill') && isGreaterThanZero(bill, 'bill'),
    people: (people) => isNumber(people, 'people') && isInteger(people, 'people') && isGreaterThanZero(people, 'people'),
    tip: (tip) => isNumber(tip, 'tip') && tip >= 0
};

function isNumber(value, type) {
    return !isNaN(value);
}

function isInteger(value, type) {
    return Number.isInteger(value);
}

function isGreaterThanZero(value, type) {
    return value > 0;
}

function dataIsValid(key, value, validations) {
    if (!validations[key]) return true;
    return validations[key](value);
}

//____________________________________________________________
// ERROR STATE MANAGEMENT
//____________________________________________________________

const errorState = {
    bill: (value) => {
        billError.textContent = value ? `Can't be ${value}` : ``;
        billError.classList.add('bill-card__error--active');
        billField.classList.add('bill-card__input--error');
    },
    people: (value) => {
        peopleError.textContent = value ? `Can't be ${value}` : ``;
        peopleError.classList.add('bill-card__error--active');
        peopleField.classList.add('bill-card__input--error');
    },
    tip: (value) => {
        customTip.classList.add('bill-card__input--error');
    }
}

const errorFreeState = {
    bill: () => {
        billError.textContent = ``;
        billError.classList.remove('bill-card__error--active');
        billField.classList.remove('bill-card__input--error');
    },
    people: () => {
        peopleError.textContent = ``;
        peopleError.classList.remove('bill-card__error--active');
        peopleField.classList.remove('bill-card__input--error');
    },
    tip: () => {
        customTip.classList.remove('bill-card__input--error');
    }
}

//____________________________________________________________
// SPLIT BILL CLASS
//____________________________________________________________

class SplitBill {
    constructor(bill, tip, people) {
        this._bill = bill;
        this._tip = tip;
        this._people = people;
    }
    
    setBill(bill) { this._bill = bill; }
    setPeople(people) { this._people = people; }
    setTip(tip) { this._tip = tip; }
    
    getBill() { return this._bill; }
    getPeople() { return this._people; }
    getTip() { return this._tip; }
    
    valuesArePresent() {
        return this._bill > 0 && this._people > 0 && this._tip >= 0; // Tip can be zero
    }
    
    calculateTip() {
        let tipInNumber = (this._bill * this._tip) / 100;
        return (tipInNumber / this._people).toFixed(2);
    }
    
    calculateTotal() {
        return (this._bill / this._people).toFixed(2);
    }
}

const splitBill = new SplitBill();
console.log(splitBill);


//____________________________________________________________
// DOM ELEMENT SELECTION & INITIAL SETUP
//____________________________________________________________

const billField = document.getElementById('bill');
const tipField = document.querySelectorAll('.bill-card__tip-percentage');
const customTip = document.querySelector('.bill-card__input-custom');
const peopleField = document.getElementById('number-of-people');
const resetButton = document.querySelector('.bill-card__reset-button');
const tipPerPerson = document.querySelector('.bill-card__total-amount--tip');
const totalPerPerson = document.querySelector('.bill-card__total-amount--total');
const billError = document.getElementById('bill-error');
const peopleError = document.getElementById('number-of-people-error');

resetButton.disabled = true;
resetButton.addEventListener('click', restoreTodefault);

//____________________________________________________________
// EVENT LISTENERS
//____________________________________________________________

billField.addEventListener('input', (e) => {
    handleInput(e, 'bill', validations);
});

peopleField.addEventListener('input', (e) => {
    handleInput(e, 'people', validations);
});

tipField.forEach(button => {
    button.addEventListener('click', handleClick);
});
customTip.addEventListener('input', (e) => {
    removeActiveFromButtons();
    handleTip(e);
});


//____________________________________________________________
// EVENT HANDLERS
//____________________________________________________________

function handleInput(event, input, validations) {
    //check data is valid or no
    const isValid = dataIsValid(input, Number(event.target.value), validations);
   
    if (isValid) {
        //set the inout value
        splitBill['set' + input[0].toUpperCase() + input.slice(1)](event.target.value); //This should create setBill() or setPeople()
        setResult();
        clearError(input);
    }
    else {
        showError(input, event.target.value);
    }
}

function handleClick(e) {
    removeActiveFromButtons(); 
    clearCustomTip();
    e.target.classList.add('bill-card__tip-button--active');
    handleTip(e, validations);
}

function handleTip(e, validations) {
    let tip = e.target.textContent || e.target.value;
    const isValid = dataIsValid('tip', parseFloat(tip), validations);
    if (isValid) {
         splitBill.setTip(parseFloat(tip));
         setResult();
         clearError('tip');
    }
    else {
        showError('tip', e.target.value);
    }
    
}

//____________________________________________________________
// ERROR MANAGEMENT
//____________________________________________________________

function clearError(input) {
    errorFreeState[input]();
}
function showError(input, value) {
    //set the error state
    errorState[input](value);
}

//____________________________________________________________
// UI STATE MANAGEMENT
//____________________________________________________________

function clearCustomTip() {
    customTip.value = ''
}

function removeActiveFromButtons() {
    tipField.forEach(button => {
        button.classList.remove('bill-card__tip-button--active');
    });
}

//____________________________________________________________
// RESULT MANAGEMENT
//____________________________________________________________

function setResult() {
    if (splitBill.valuesArePresent()) {
        tipPerPerson.textContent = splitBill.calculateTip();
        totalPerPerson.textContent = splitBill.calculateTotal();
        resetButton.disabled = false; // Enable reset button
    }
}

function restoreTodefault() {
    // Restore object values
    splitBill.setBill(undefined);
    splitBill.setTip(undefined);
    splitBill.setPeople(undefined);
    
    // Restore the form back to default
    billField.value = '';
    peopleField.value = '';
    customTip.value = '';
    removeActiveFromButtons();
    
    // Restore total back to default
    tipPerPerson.textContent = '$0.00';
    totalPerPerson.textContent = '$0.00';
    
    // Disable reset button
    resetButton.disabled = true;
}

