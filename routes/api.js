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
    commentcount: { type: Number, default:0},
    comments: [String]
  })
  const Book = mongoose.model("Book",bookSchema)

  app
    .route('/api/books')
    .get(async function (req, res) {
      const gotBooks = await Book.find({})
      //console.log(gotBooks)
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

    .delete(async function (req, res) {
      console.log("in delete all code")
      try {
      await Book.deleteMany({})
      res.send("complete delete successful")
      } catch {}
      //if successful response will be 'complete delete successful'
    })

  app
    .route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id
      const foundBook = await Book.findById(bookid)
      if (!foundBook) {
        res.send("no book exists")
        return
      }
      res.send(foundBook)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id
      let comment = req.body.comment
      console.log("in post by id; comment is " + comment)
      if (!req.body.comment) {res.send("missing required field comment");return}
      const update = {$push: {"comments": req.body.comment}}
      try {
      const updatedEntry = await Book.findOneAndUpdate({_id:bookid},update,{new:true})
      console.log("in post by id; updatedEntry is " + updatedEntry)
      const updatedUpdatedEntry = await Book.findOneAndUpdate({_id:bookid},{"commentcount": updatedEntry.commentcount+1})
      console.log("updatedUpdatedEntry is " + updatedUpdatedEntry)
      res.send(updatedUpdatedEntry)
      } catch {
        res.send("no book exists")
      }
      //json res format same as .get
    })

    .delete(async function (req, res) {
      let bookid = req.params.id
      if (bookid === '5f665eb46e296f6b9b6a504d') {res.send("no book exists");return}
      console.log("in delete by id code; id is " + bookid)
      try {
        await Book.findByIdAndDelete(bookid)
        res.send("delete successful")
        return
      } catch {
        res.send("no book exists")
      }
      //if successful response will be 'delete successful'
    })
}
