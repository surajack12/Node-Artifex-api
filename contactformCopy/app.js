const express = require('express');
const app = express();
const contactApi =require('./contactApi');

app.use('/',contactApi);
module.exports = app;