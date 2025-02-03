
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db')
 const cookieParser = require('cookie-parser');



dotenv.config();
connectDB();
//app.use(express.json());

const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

PORT = 2000

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/noteRoutes'));

app.listen(PORT, ()=> {
    console.log(`Example app listening on port ${PORT}`);
});
