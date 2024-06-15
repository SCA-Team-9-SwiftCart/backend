require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./src/controllers/user'); // Ensure the correct path

const app = express();

const SERVER_PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI;

app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('bufferCommands', false);

// Connect to MongoDB
mongoose.connect(DB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

// Use user routes
app.use('/api', userRouter);

app.listen(SERVER_PORT, () => 
  console.log('Server listening on port ' + SERVER_PORT)
);
