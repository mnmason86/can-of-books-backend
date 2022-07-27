'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.DATABASE_URL);
const PORT = process.env.PORT || 3001;

const Book = require('./models/Book.js');
app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
})

app.get('/books', getBooks);

app.post('/books', postBooks);

async function getBooks(req, res, next) {
  let bookQuery = {};
  if (req.query.title) {
    bookQuery = {
      title: req.query.title
    }
  }
  try {
    let results = await Book.find(bookQuery);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

async function postBooks(req, res, next) {
  try {
    let submittedBook = await Book.create(req.body);
    console.log(submittedBook);
    res.status(200).send(submittedBook);
  } catch (error) {
    next(error);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
})

app.get('/test', (request, response) => {
  response.send('test request received')
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));

