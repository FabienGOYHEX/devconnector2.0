const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Data Base
connectDB();

app.get('/', (req, res) => res.send('API Running'));
app.get('/hello', (req, res) => res.send('hello world'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
