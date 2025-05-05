'use strict';

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

const users = [user1, user2];
let currentUser = null;

const loginForm = document.querySelector('.loginForm');
const logoutForm = document.querySelector('.logoutForm');
const mainContainer = document.querySelector('.mainContainer');
const formText = document.querySelector('.form-text');
const currentDate = document.querySelector('.currentDate');
const totalBalance = document.querySelector('.totalBalance');
const transactionList = document.querySelector('.transactionList');
const totalIn = document.querySelector('.totalIn');
const totalOut = document.querySelector('.totalOut');
const totalInterest = document.querySelector('.totalInterest');
const countdown = document.querySelector('.countdown');

const updateCurrentDate = function () {
    const date = new Date();
    currentDate.textContent = date;
};

const updateTotalBalance = function () {
    const total = currentUser.movements.reduce((total, el) => total + el);
    console.log(total, currentUser);
    totalBalance.textContent = `${total}`;
};

const updateTransactions = function () {
    const create = el => document.createElement(el);
    for (let i = currentUser.movements.length - 1; i >= 0; i--) {
        let trans = currentUser.movements[i];
        const li = create('li');
        const div = document.createElement('div');
        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        const span3 = document.createElement('span');
        li.classList.add('transactionItem', 'd-flex', 'justify-content-between', 'align-items-center', 'ps-5', 'pe-5', 'border-bottom');
        if (trans < 0) {
            span1.classList.add('badge', 'text-bg-danger');
            span1.textContent = `${i + 1} Withdrawal`;
        } else {
            span1.classList.add('badge', 'text-bg-primary');
            span1.textContent = `${i + 1} Deposit`;
        }
        span2.classList.add('movementDate', 'ms-3');
        span2.textContent = currentUser.movementDates[i];
        span3.classList.add('fs-5');
        span3.textContent = Math.abs(trans);
        div.append(span1, span2);
        li.append(div, span3);
        transactionList.append(li);
    }
};

const updateTotals = function () {
    const sumIn = currentUser.movements.filter(el => el > 0).reduce((total, el) => total + el);
    const sumOut = currentUser.movements.filter(el => el < 0).reduce((total, el) => total + Math.abs(el), 0);
    const sumInterest = sumIn * (currentUser.interestRate / 100);
    totalIn.textContent = sumIn;
    totalOut.textContent = sumOut;
    totalInterest.textContent = sumInterest.toFixed(2);
};

const toggleLoginElements = function () {
    mainContainer.classList.toggle('d-none');
    loginForm.classList.toggle('d-none');
    logoutForm.classList.toggle('d-none');
};

const userLoggedOut = () => {
    currentUser = null;
    toggleLoginElements();
};

const logoutTimer = function () {
    const date = Date.now() + 10 * 60 * 1000 + 1000;
    const autoLogout = setInterval(() => {
        let dateNow = Date.now();
        let timeLeft = date - dateNow;
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        countdown.textContent = `You'll be automatically logged out in ${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
        if (dateNow > date) {
            userLoggedOut();
            countdown.textContent = `You'll be automatically logged out in 10:00`;
            clearInterval(autoLogout);
        }
    }, 1000);
};

const userLoggedIn = foundUser => {
    currentUser = foundUser;
    formText.textContent = `Welcome back, ${currentUser.name}!`;
    toggleLoginElements();
    updateCurrentDate();
    updateTotalBalance();
    updateTransactions();
    updateTotals();
    logoutTimer();
};

loginForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const usernameInput = document.querySelector('.usernameInput');
    const passwordInput = document.querySelector('.passwordInput');
    let foundUser = users.find(el => el.username === usernameInput.value);
    if (foundUser && foundUser.pin === +passwordInput.value) userLoggedIn(foundUser);
    usernameInput.value = '';
    passwordInput.value = '';
});

logoutForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    userLoggedOut();
});

// const currentDate = document.querySelector('.currentDate');

// const date = new Date();
// const day = date.getDate();
// const month = date.getMonth() + 1; // Months are zero-based
// const year = date.getFullYear();
// const hours = date.getHours();
// const minutes = date.getMinutes();

// currentDate.textContent = `As of ${day}/${month}/${year} ${hours}:${minutes}`;

// const loginForm = document.querySelector('.loginForm');

// loginForm.addEventListener('submit', function (evt) {
//     evt.preventDefault();
// });
