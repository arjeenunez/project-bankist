'use strict';

// Models
//prettier-ignore
const user1 = {
    name: 'Jeffrey Knight',
    username: 'jk',
    movement: [
        { no: 1, amount: 200, date: '2023-01-18T21:31:17.178Z' },
        { no: 2, amount: 450, date: '2023-01-23T07:42:02.383Z' },
        { no: 3, amount: -400, date: '2023-01-28T09:15:04.904Z' },
        { no: 4, amount: 3000, date: '2023-02-01T10:17:24.185Z' },
        { no: 5, amount: -650, date: '2023-02-05T14:11:59.604Z' },
        { no: 6, amount: -130, date: '2023-02-10T17:01:17.194Z' },
        { no: 7, amount: 70, date: '2023-02-15T23:36:17.929Z' },
        { no: 8, amount: 1300, date: '2023-02-20T10:51:36.790Z' },
    ],
    interestRate: 1.2, // %
    pin: 1111,
};

//prettier-ignore
const user2 = {
    name: 'Tina Roberts',
    username: 'tr',
    movement: [
        { no: 1, amount: 500, date: '2023-03-01T08:15:30.000Z' },
        { no: 2, amount: 340, date: '2023-03-05T12:45:00.000Z' },
        { no: 3, amount: -150, date: '2023-03-10T14:20:15.000Z' },
        { no: 4, amount: -790, date: '2023-03-15T16:30:45.000Z' },
        { no: 5, amount: -3210, date: '2023-03-20T18:50:10.000Z' },
        { no: 6, amount: -1000, date: '2023-03-25T20:10:25.000Z' },
        { no: 7, amount: 850, date: '2023-03-30T22:05:35.000Z' },
        { no: 8, amount: -30, date: '2023-04-04T23:55:50.000Z' },
    ],
    interestRate: 1.5, // %
    pin: 1234,
};

let users = [user1, user2];
let currentUser = null;

const userUpdate = function (user, amount = null, date = new Date()) {
    if (amount) {
        user.movement.push({ no: user.movement.length + 1, amount, date });
    }
    user.total = user.movement.reduce((total, el) => total + el.amount, 0);
    user.sumIn = user.movement.filter(el => el.amount > 0).reduce((total, el) => total + el.amount, 0);
    user.sumOut = user.movement.filter(el => el.amount < 0).reduce((total, el) => total + Math.abs(el.amount), 0);
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
    li.className = 'transactionItem d-flex justify-content-between align-items-center ps-5 pe-5 border-bottom';
    const badgeChoice = price < 0 ? 'text-bg-danger' : 'text-bg-primary';
    const transactionChoice = price < 0 ? 'Withdrawal' : 'Deposit';
    li.innerHTML = `
        <div>
            <span class="badge ${badgeChoice}">${transNum} ${transactionChoice}</span>
            <span class="movementDate ms-3">${date}</span>
        </div>
        <span class="fs-5">${Math.abs(price)}</span>`;
    transactionList.prepend(li);
};

const clearTransactions = function () {
    const transactionList = document.querySelector('.transactionList');
    transactionList.innerHTML = '';
};

const viewCurrentSummary = function ({ sumIn, sumOut, sumInterest }) {
    document.querySelector('.totalIn').textContent = sumIn;
    document.querySelector('.totalOut').textContent = sumOut;
    document.querySelector('.totalInterest').textContent = sumInterest.toFixed(2);
};

const viewCurrentTimer = function (minutes = 10, seconds = 0) {
    let mins = minutes < 10 ? `0${minutes}` : minutes;
    let secs = seconds < 10 ? `0${seconds}` : seconds;
    document.querySelector('.countdown').textContent = `You'll be automatically logged out in ${mins}:${secs}`;
};

const toggleLoginElements = function () {
    const toggleDisplay = domNode => {
        if (domNode.classList.contains('fullyHidden')) {
            domNode.classList.toggle('fullyHidden');
            setTimeout(() => domNode.classList.toggle('hidden'), 0);
        } else {
            domNode.classList.toggle('hidden');
            domNode.classList.toggle('fullyHidden');
        }
    };
    const nodeElements = [document.querySelector('.mainContainer'), loginForm, logoutForm];
    nodeElements.forEach(component => toggleDisplay(component));
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
    for (let i = 0; i < user.movement.length; i++) {
        createTransaction(user.movement[i].amount, user.movement[i].no, user.movement[i].date);
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
const sortBtn = document.querySelector('.sortBtn');

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
    createTransaction(+loanAmount.value, currentUser.movement.length);
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
        createTransaction(-Number(transferAmount.value), currentUser.movement.length);
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

    closeUsername.value = '';
    closePassword.value = '';
});

sortBtn.addEventListener('click', function () {
    clearTransactions();
    this.count = (this.count || 0) + 1;
    const chosenOption = this.count % 3;
    const options = [
        { comp: (a, b) => a.amount - b.amount, text: '↑ Sort' },
        { comp: (a, b) => b.amount - a.amount, text: 'Sort' },
        { comp: (a, b) => a.no - b.no, text: '↓ Sort' },
    ];
    const { comp, text } = options[chosenOption];
    currentUser.movement.sort(comp);
    this.textContent = text;
    currentUser.movement.forEach(({ amount, no, date }) => createTransaction(amount, no, date));
});
