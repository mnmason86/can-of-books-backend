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
const BookModel = require('./models/Book.js');
const { response } = require('express');


app.get('/', (request, response) => {
  response.status(200).send('Welcome!');
})

app.get('/books', getBooks);

app.post('/books', postBooks);

app.delete('/books/:id', deleteBook);

async function getBooks(req, res, next) {

  let bookQuery = {};
  if (req.query.title) {
    bookQuery = {
      title: req.query.title
    }
  }
  try {
    let results = await BookModel.find(bookQuery);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
}

async function postBooks(req, res, next) {
  console.log(req.body);
  try {
    let submittedBook = await BookModel.create(req.body);
    console.log(submittedBook);
    res.status(200).send(submittedBook);
  } catch (error) {
    next(error);
  }
}

async function deleteBook(req, res, next) {

  console.log(req.params);
  const bookID = req.params.id;
  try {

    let deleteStatus = await BookModel.deleteOne({ _id: bookID });
    res.send(deleteStatus);
  } catch (error) {
    next(error);
  }
}

app.get('*', (request, response) => {
  response.status(404).send('Not availabe');
})

app.use((error, req, res, next) => {
  res.status(500).send(error);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));

