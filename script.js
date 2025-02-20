// The journey of a thousand miles starts with a single step //

// VALIDATION FUNCTIONS
const validations = {
    bill: (bill) => isNumber(bill) && isGreaterThanZero(bill),
    people: (people) => isInteger(people) && isGreaterThanZero(people),
    tip: (tip) => isNumber(tip) && tip >= 0
};

function isNumber(value) {
    return !isNaN(value);
}
function isInteger(value) {
    return Number.isInteger(value);
}
function isGreaterThanZero(value) {
    return value > 0;
}
function dataIsValid(key, value, validations) {
    if (!validations[key]) return true;
    return validations[key](value);
}

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
const tipField = document.querySelectorAll('.bill-card__tip-button');
const peopleField = document.getElementById('number-of-people');
const resetButton = document.querySelector('.bill-card__reset-button');
const tipPerPerson = document.querySelector('.bill-card__tip-amount');
const totalPerPerson = document.querySelector('.bill-card__total-amount');

// INITIAL SETUP
resetButton.disabled = true;
resetButton.addEventListener('click', restoreTodefault);

// EVENT LISTENERS
billField.addEventListener('input', () => {
    if (dataIsValid('bill', parseFloat(billField.value), validations)) {
        splitBill.setBill(parseFloat(billField.value));
    }
    setResult();
});

peopleField.addEventListener('input', () => {
    if (dataIsValid('people', Number(peopleField.value), validations)) {
        splitBill.setPeople(Number(peopleField.value));
    }
    setResult();
});

tipField.forEach(button => {
    button.addEventListener('click', handleClick);
});

// EVENT HANDLERS
function handleClick(e) {
    removeActive();
    e.target.classList.add('bill-card__tip-button--active');
    handleTip(e);
}

function handleTip(e) {
    let tipSelection = e.target.textContent;
    if (tipSelection === 'Custom') {
        splitBill.setTip(getCustomTip());
    } else {
        if (dataIsValid('tip', parseFloat(tipSelection), validations)) {
            splitBill.setTip(parseFloat(tipSelection));
        }
        setResult();
    }
}

function removeActive() {
    tipField.forEach(button => {
        button.classList.remove('bill-card__tip-button--active');
    });
}

function getCustomTip() {
    let customInput = document.createElement('input');
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
    removeActive();
    
    // Restore total back to default
    tipPerPerson.textContent = '$0.00';
    totalPerPerson.textContent = '$0.00';
    
    // Disable reset button
    resetButton.disabled = true;
}
