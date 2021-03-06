const express = require('express');
const connectDB = require('./config/db');


const app = express();

//Connect Data Base
connectDB();

// Init Middleware
app.use(express.json({ extend: false }))//permet d'afficher le body de la request (bodyParser)



app.get('/', (req, res) => res.send('API Running'));

//Define route
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/post', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
