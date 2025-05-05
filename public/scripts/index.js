'use strict';

// Models

const user1 = {
    name: 'Jeffrey Knight',
    username: 'jk',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    movementDates: [
        '2023-01-18T21:31:17.178Z',
        '2023-01-23T07:42:02.383Z',
        '2023-01-28T09:15:04.904Z',
        '2023-02-01T10:17:24.185Z',
        '2023-02-05T14:11:59.604Z',
        '2023-02-10T17:01:17.194Z',
        '2023-02-15T23:36:17.929Z',
        '2023-02-20T10:51:36.790Z',
    ],
    interestRate: 1.2, // %
    pin: 1111,
};

const user2 = {
    name: 'Tina Roberts',
    username: 'tr',
    movements: [500, 340, -150, -790, -3210, -1000, 850, -30],
    movementDates: [
        '2023-03-01T08:15:30.000Z',
        '2023-03-05T12:45:00.000Z',
        '2023-03-10T14:20:15.000Z',
        '2023-03-15T16:30:45.000Z',
        '2023-03-20T18:50:10.000Z',
        '2023-03-25T20:10:25.000Z',
        '2023-03-30T22:05:35.000Z',
        '2023-04-04T23:55:50.000Z',
    ],
    interestRate: 1.5, // %
    pin: 1234,
};

let users = [user1, user2];
let currentUser = null;

const userUpdate = function (user, amount = null, date = new Date()) {
    if (amount) {
        user.movements.push(amount);
        user.movementDates.push(date);
    }
    user.total = user.movements.reduce((total, el) => total + el);
    user.sumIn = user.movements.filter(el => el > 0).reduce((total, el) => total + el);
    user.sumOut = user.movements.filter(el => el < 0).reduce((total, el) => total + Math.abs(el), 0);
    user.sumInterest = user.sumIn * (user.interestRate / 100);
};

const userDelete = function (user) {
    users = users.filter(el => el.username !== user.username);
};

// Views

const viewCurrentLoginText = function (name) {
    const formText = document.querySelector('.form-text');
    formText.textContent = `Welcome back, ${name}!`;
};

const viewCurrentDate = function () {
    const currentDate = document.querySelector('.currentDate');
    const date = new Date();
    currentDate.textContent = date;
};

const viewCurrentTotalBalance = function (user) {
    const totalBalance = document.querySelector('.totalBalance');
    totalBalance.textContent = `${user.total}€`;
};

const createTransaction = function (price, transNum, date = new Date()) {
    const transactionList = document.querySelector('.transactionList');
    const li = document.createElement('li');
    const div = document.createElement('div');
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');
    const span3 = document.createElement('span');
    li.classList.add('transactionItem', 'd-flex', 'justify-content-between', 'align-items-center', 'ps-5', 'pe-5', 'border-bottom');
    span1.classList.add('badge', `${price < 0 ? 'text-bg-danger' : 'text-bg-primary'}`);
    span1.textContent = `${transNum} ${price < 0 ? 'Withdrawal' : 'Deposit'}`;
    span2.classList.add('movementDate', 'ms-3');
    span2.textContent = date;
    span3.classList.add('fs-5');
    span3.textContent = Math.abs(price);
    div.append(span1, span2);
    li.append(div, span3);
    transactionList.prepend(li);
};

const clearTransactions = function () {
    const transactionList = document.querySelector('.transactionList');
    transactionList.innerHTML = '';
};

const viewCurrentSummary = function (user) {
    const totalIn = document.querySelector('.totalIn');
    const totalOut = document.querySelector('.totalOut');
    const totalInterest = document.querySelector('.totalInterest');
    totalIn.textContent = user.sumIn;
    totalOut.textContent = user.sumOut;
    totalInterest.textContent = user.sumInterest.toFixed(2);
};

const viewCurrentTimer = function (minutes = 10, seconds = 0) {
    const countdown = document.querySelector('.countdown');
    let mins = minutes < 10 ? `0${minutes}` : minutes;
    let secs = seconds < 10 ? `0${seconds}` : seconds;
    countdown.textContent = `You'll be automatically logged out in ${mins}:${secs}`;
};

const toggleLoginElements = function () {
    const mainContainer = document.querySelector('.mainContainer');
    mainContainer.classList.toggle('d-none');
    loginForm.classList.toggle('d-none');
    logoutForm.classList.toggle('d-none');
};

// Controllers

const loggedIn = user => {
    userUpdate(user);
    toggleLoginElements();
    viewCurrentDate();
    viewCurrentTotalBalance(user);
    viewCurrentSummary(user);
    clearTransactions();
    viewCurrentLoginText(user.name);
    for (let i = 0; i < user.movements.length; i++) {
        createTransaction(user.movements[i], i + 1, user.movementDates[i]);
    }
};

const loggedOut = () => {
    clearTransactions();
    toggleLoginElements();
    viewCurrentTimer();
};

let intervalCountdown = null;

const logoutTimerEnd = () => clearInterval(intervalCountdown);

const logoutTimerStart = function () {
    const date = Date.now() + 10 * 60 * 1000 + 1000;
    intervalCountdown = setInterval(() => {
        let dateNow = Date.now();
        let timeLeft = date - dateNow;
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        viewCurrentTimer(minutes, seconds);
        if (dateNow > date - 1000) {
            currentUser = null;
            toggleLoginElements();
            logoutTimerEnd();
        }
    }, 1000);
};

// Controllers - events

const loginForm = document.querySelector('.loginForm');
const logoutForm = document.querySelector('.logoutForm');
const requestLoanForm = document.querySelector('.requestLoan');
const transferMoneyForm = document.querySelector('.transferMoney');
const closeAccountForm = document.querySelector('.closeAccount');

loginForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const usernameInput = document.querySelector('.usernameInput');
    const passwordInput = document.querySelector('.passwordInput');
    const foundUser = users.find(el => el.username === usernameInput.value);
    if (foundUser && foundUser.pin === +passwordInput.value) {
        currentUser = foundUser;
        loggedIn(currentUser);
        logoutTimerStart();
    }
    usernameInput.value = '';
    passwordInput.value = '';
});

logoutForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    loggedOut(currentUser);
    logoutTimerEnd();
});

requestLoanForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const loanAmount = document.querySelector('.loanAmount');
    userUpdate(currentUser, +loanAmount.value);
    viewCurrentSummary(currentUser);
    viewCurrentTotalBalance(currentUser);
    createTransaction(+loanAmount.value, currentUser.movements.length);
    loanAmount.value = '';
});

transferMoneyForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const transferUser = document.querySelector('.transferUser');
    const transferAmount = document.querySelector('.transferAmount');
    const foundUser = users.find(el => el.username === transferUser.value);
    if (foundUser && foundUser.username !== currentUser.username && +transferAmount.value <= currentUser.total && +transferAmount.value > 0) {
        userUpdate(currentUser, -Number(transferAmount.value));
        userUpdate(foundUser, +transferAmount.value);
        viewCurrentSummary(currentUser);
        viewCurrentTotalBalance(currentUser);
        createTransaction(-Number(transferAmount.value), currentUser.movements.length);
    }
    transferAmount.value = '';
    transferUser.value = '';
});

closeAccountForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const closeUsername = document.querySelector('.closeUsername');
    const closePassword = document.querySelector('.closePassword');

    const foundUser = users.find(el => el.username === closeUsername.value);
    if (foundUser && foundUser.username === currentUser.username && +closePassword.value === currentUser.pin) {
        userDelete(currentUser);
        logoutTimerEnd();
        loggedOut(currentUser);
    }
});
