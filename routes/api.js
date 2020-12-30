/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
var mongoose = require('mongoose');
require('dotenv').config();
const connection = require('../config/database.js');


//get instance
const Book = connection.models.Book;
const Comment = connection.models.Comment;


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects

      Book.find({},function(err,data){

              if(err){console.log("dw err11", err.message)}

                
               let newArray  = data.map(item => {

                      let resObj = {} 
                      // let len = data.comments.length;

                      resObj['_id'] =item._id,
                      resObj['title'] =item.title,
                      resObj['commentcount'] = item.comments.length;

                     return resObj 

               })

              //console.log(data)
            
            res.json(newArray)

            


      })

      // [{"_id":"5f92ad26ecf6535f89051020","title":"q","commentcount":4},{"_id":"5f92adf2ecf6535f89051021","title":"aa","commentcount":0}]

      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){

      var titleName = req.body.title;
      console.log(titleName)

      if(!titleName){
        console.log("dw no title")
         return res.send("missing title")  // no title added - exit
         
      }
      
      
      let newBook = new Book({title: titleName});

      //check if book exists
      //      title already exists
      Book.find({title: titleName }, function(err,data){

              if(err){console.log("dw err11", err.message)}

              // console.log("find", data)
              // console.log("find", data.length)
              if(data.length > 0){
                console.log("title already exists")

                return res.send("title already exists");

              } else{
                     //add book
                     newBook.save().then((data)=>{

                    const resObj = {title: titleName, comments:[], _id: data._id};
                    return res.json(resObj);

                  }).catch((err)=>{
                        console.log("dw err", err.message);
                        return res.status(404).json("dw err...." + err.message);
                  })


              }
         
       
      })

           

      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      
                // delete all books
          Book.deleteMany({},function(err,data){
                 if(err){console.log("dw err11", err.message);}
                  console.log("dw all records deleted")
                 return res.send("complete delete successful");

          })



    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      console.log(bookid)
              Book.findById(bookid, function(err,data){

                     if(err){
                //console.log("dw err", err.message);
                        if (err instanceof mongoose.CastError){
                              return res.send("no book exists");
                        } else {
                            return res.send("dw err...." + err.message);
                        }
            
                     } else{
                        console.log('dw  id', data)


                        let resObj = {

                            _id: data._id,
                             title: data.title,
                              comments: data.comments
                        } 
                      
                      res.send(resObj)
                                          


                     }


            })






    })
    


    .post(function(req, res){
      var bookid = req.params.id;
      var comments = req.body.comment;

   // new: bool - true to return the modified document rather than the original. defaults to false
    //   A.findByIdAndUpdate(id, update, options, callback) // executes
    Book.findByIdAndUpdate(bookid, { $push: {comments: comments} }, {new: true},  function(err, data){
              
                 if(err){
                //console.log("dw err", err.message);
                        if (err instanceof mongoose.CastError){
                              return res.send("no book exists");
                        } else {
                            return res.send("dw err...." + err.message);
                        }
            
                } else{

                      //{"_id":"5f92ed2becf6535f89051024","title":"yy","comments":["fd"]}

                      console.log("dwdww",data);

                        let resObj = { 
                              _id: data.id,
                              title: data.title,
                              comments: data.comments
                                }

                        return res.json(resObj)
                              

                };


    })



     
    })  // end of post
    
    .delete(function(req, res){
      var bookid = req.params.id;


        // Character.deleteOne({ name: 'Eddard Stark' }, function (err) {});
            Book.deleteOne({'_id': bookid}, function(err,data){

                     if(err){
                //console.log("dw err", err.message);
                        if (err instanceof mongoose.CastError){
                              return res.send("no book exists");
                        } else {
                            return res.send("dw err...." + err.message);
                        }
            
                     } else{
                        console.log('dw  id deleted')
                        return res.send("delete successful")

                     }


            })



      //if successful response will be 'delete successful'

    });
  
};
