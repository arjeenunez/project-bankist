'use strict';

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const engine = require('ejs-mate');
const users = require('./helpers/sampleUsers');
const AppError = require('./utilities/AppError');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    res.render('main/main', { users });
});

app.all(/[\s\S]*/, (req, res, next) => {
    next(new AppError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = '404', message = 'Page not found' } = err;
    res.status(statusCode).send({ message, statusCode });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
