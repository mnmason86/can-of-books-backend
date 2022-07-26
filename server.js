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
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected');
});

app.get('/', (request, response) => {  response.status(200).send('Welcome!');})

// app.post('/books', postBooks);


app.get('/books', (req,res) => {

  let {title, description, status} = req.query;
  let bookQuery = {};

  if(title){
    bookQuery.title = title;
  }
  if(description){
    bookQuery.description = description;
  }
  if(status){
    bookQuery.status = status;
  }
  Book.find(bookQuery)
    .then(bookData => {
      res.send(bookData);
    });
});
// async function postBooks(req,res,next){
//   try {
//     let submittedBook = await Book.create(req.body);
//     console.log(submittedBook);
//     res.status(200).send(submittedBook);
//   }
//   catch (error){
//     next(error);
//   }
// }

app.get('*', (request, response) => {  response.status(404).send('Not available');})
// app.get('/test', (request, response) => {  response.send('test request received');})
app.listen(PORT, () => console.log(`listening on ${PORT}`));
