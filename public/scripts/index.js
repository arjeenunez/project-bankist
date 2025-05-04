'use strict';

const currentDate = document.querySelector('.currentDate');

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1; // Months are zero-based
const year = date.getFullYear();
const hours = date.getHours();
const minutes = date.getMinutes();

currentDate.textContent = `As of ${day}/${month}/${year} ${hours}:${minutes}`;

const loginForm = document.querySelector('.loginForm');

loginForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
});
