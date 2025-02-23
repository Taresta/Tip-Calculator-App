// The journey of a thousand miles starts with a single step //

// VALIDATION FUNCTIONS
const validations = {
    bill: (bill) => isNumber(bill, 'bill') && isGreaterThanZero(bill, 'bill'),
    people: (people) => isNumber(people, 'people') && isInteger(people, 'people') && isGreaterThanZero(people, 'people'),
    tip: (tip) => isNumber(tip, 'tip') && tip >= 0
};

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
function isNumber(value, type) {
    //set error state
    // errorState[type] = !isNaN(value)? '': `Can't be a non-number value`;
    return !isNaN(value);
}
function isInteger(value, type) {
    //set error state
    // errorState[type] = Number.isInteger(value)? '': `Can't be fraction`;
    return Number.isInteger(value);
}
function isGreaterThanZero(value, type) {
    //set error state
    // errorState[type] = (value > 0)? '': `Can not be ${value}`;
    return value > 0;
}
function dataIsValid(key, value, validations) {
    if (!validations[key]) return true;
    return validations[key](value);

    //Find the specific reason for the error
}

//APPEARANCE FUNCTIONS



// SPLIT BILL CLASS
class SplitBill {
    constructor(bill, tip, people) {
        this.bill = bill;
        this.tip = tip;
        this.people = people;
    }
    
    setBill(bill) { this.bill = bill; }
    setPeople(people) { this.people = people; }
    setTip(tip) { this.tip = tip; }
    
    getBill() { return this.bill; }
    getPeople() { return this.people; }
    getTip() { return this.tip; }
    
    valuesArePresent() {
        return this.bill > 0 && this.people > 0 && this.tip >= 0; // Tip can be zero
    }
    
    calculateTip() {
        let tipInNumber = (this.bill * this.tip) / 100;
        return (tipInNumber / this.people).toFixed(2);
    }
    
    calculateTotal() {
        return (this.bill / this.people).toFixed(2);
    }
}

const splitBill = new SplitBill();
console.log(splitBill);

// DOM ELEMENT SELECTION
const billField = document.getElementById('bill');
const tipField = document.querySelectorAll('.bill-card__tip-percentage');
const customTip = document.querySelector('.bill-card__input-custom');
const peopleField = document.getElementById('number-of-people');
const resetButton = document.querySelector('.bill-card__reset-button');
const tipPerPerson = document.querySelector('.bill-card__total-amount--tip');
const totalPerPerson = document.querySelector('.bill-card__total-amount--total');
const billError = document.getElementById('bill-error');
const peopleError = document.getElementById('number-of-people-error');

// INITIAL SETUP
resetButton.disabled = true;
resetButton.addEventListener('click', restoreTodefault);

// EVENT LISTENERS
billField.addEventListener('input', (e) => {
    handleInput(e, 'bill');
});

peopleField.addEventListener('input', (e) => {
    handleInput(e, 'people');
});

tipField.forEach(button => {
    button.addEventListener('click', handleClick);
});
customTip.addEventListener('input', (e) => {
    removeActiveFromButtons();
    handleTip(e);
});

// EVENT HANDLERS

function handleInput(event, input) {
    //check data is valid or no
    const isValid = dataIsValid(input, Number(event.target.value), validations);
   
    if (isValid) {
        splitBill[input] = event.target.value;
        setResult();
        clearError(input);
    }
    else {
        showError(input, event.target.value);
    }
}
function clearError(input) {
    errorFreeState[input]();
}
function showError(input, value) {
    //set the error state
    errorState[input](value);
}
function handleClick(e) {
    removeActiveFromButtons(); 
    clearCustomTip();
    e.target.classList.add('bill-card__tip-button--active');
    handleTip(e);
}

function handleTip(e) {
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

function clearCustomTip() {
    customTip.value = ''
}
function removeActiveFromButtons() {
    tipField.forEach(button => {
        button.classList.remove('bill-card__tip-button--active');
    });
}

// RESULT MANAGEMENT
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
