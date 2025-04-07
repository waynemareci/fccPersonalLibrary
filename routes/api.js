/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

module.exports = function (app) {
  const mongoose    = require('mongoose');
  const Schema = mongoose.Schema
  const bookSchema = new Schema({
    title: { type: String, required: true },
    commentcount: { type: Number, default:0}
  })
  const Book = mongoose.model("Book",bookSchema)

  app
    .route('/api/books')
    .get(async function (req, res) {
      const gotBooks = await Book.find({})
      console.log(gotBooks)
      res.send(gotBooks)
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let title = req.body.title
      console.log('processing post; title is ' + title)
      if (!req.body.title) { res.send("missing required field title");return }
      const foundBook = await Book.findOne({ title: title })
      if (!foundBook) {
        const instance = new Book({ title: title })
        const savedBook = await instance.save()
        const activeId = savedBook._id
        console.log('saved new Book instance; activeId is ' + activeId)
        res.json({title:savedBook.title,_id:savedBook._id})
        return
      }
      else {
        console.log("Found book! " + foundBook.title)
        res.json({title:foundBook.title,_id:foundBook._id})
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    })

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id
      let comment = req.body.comment
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id
      //if successful response will be 'delete successful'
    })
}
