const express = require('express');
const connectDB = require('./config/db');
const router = require('./routes/api/users')

const app = express();

//Connect Data Base
connectDB();


app.get('/', (req, res) => res.send('API Running'));
app.get('/hello', (req, res) => res.send('hello world'));

//Define route
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
