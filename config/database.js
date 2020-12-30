const mongoose = require('mongoose');
require('dotenv').config();

const conn = process.env.MONGO_URI;

const connection = mongoose.createConnection(conn,{
  useNewUrlParser: true,       // surpress warning messages
    useUnifiedTopology: true       // surpress warning messages
})


const BookSchema = new mongoose.Schema({
          title: {type: String, trim:true, required: true},
          comments: [{type: String, trim:true}]
         
});

const CommentSchema  = new mongoose.Schema({
          // id: {type: String, trim:true},
          // title: {type: String, trim:true},
          comments: {type: String, trim:true,required: true}
});

const Book  = connection.model('Book', BookSchema);
const Comment  = connection.model('Comment', CommentSchema);


module.exports = connection;