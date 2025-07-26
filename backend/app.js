//This file sets up the express and cofigs the middleware

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials:true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pizza', require('./routes/pizza'));
app.use('/api/order', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));

module.exports = app;