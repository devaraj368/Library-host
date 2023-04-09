// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const authData = require("./src/model/authData");
const booksData = require("./src/model/booksData");
const jwt = require("jsonwebtoken");



const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
const PORT = 3000; 



const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/frontend')));

//  mongoDB connection 
  const connectDB =     
  "mongodb+srv://devarajp368:devaraj1@cluster0.fl8wohu.mongodb.net/LibraryDB" ;
    mongoose.connect(connectDB, {useNewUrlParser: true, useUnifiedTopology: true});


    // middleware function to verify Token
function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).send("Unauthorized request");
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
      return res.status(401).send("Unauthorized request");
    }
    let payload = jwt.verify(token, "secretKey");
    if (!payload) {
      return res.status(401).send("Unauthorized request");
    }
    req.adminId = payload.subject;
    next();
  }


//   Login
app.post("/api/login", (req, res) => {
    let logData = req.body;
  
    authData.findOne({ email: logData.email })
      .then(user => {
        if (!user) {
          return res.status(401).send("Invalid email");
        }
        if (user.password !== logData.password) {
          return res.status(401).send("Invalid password");
        }
        let payload = { subject: user._id };
        let token = jwt.sign(payload, "secretKey");
        res.status(200).send({ token });
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Internal server error");
      });
  });
  



// signup post req
app.post("/api/signUp", (req, res) => {
    var signUpDetails = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    var logData = authData(signUpDetails);
    logData.save();
  
    authData.find().then((logData) => {
      res.send(logData);
    });
  });

  // Add Books data POST
app.post("/api/addBooks", (req, res) => {
    var addBooks = {
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      rating: req.body.rating,
      image: req.body.image,
    };
    var addBookData = booksData(addBooks);
    addBookData.save();
  
    booksData.find().then((addBookData) => {
      res.send(addBookData);
    });
  });
  
  // GET on Books
  app.get("/api/books", (req, res) => {
    booksData.find().then((addBookData) => {
      res.send(addBookData);
    });
  });
  
  app.get("/api/books/:id", (req, res) => {
    const id = req.params.id;
    booksData.findOne({ _id: id }).then((book) => {
      res.send(book);
    });
  });
  
  // Update a Book
  app.put("/api/update", (req, res) => {
    var id = req.params.id;
    var title = req.params.title;
    var author = req.params.author;
    var genre = req.params.genre;
    var description = req.params.description;
    var rating = req.params.rating;
    var image = req.params.image;
  
    console.log(req.body);
    (id = req.body._id),
      (title = req.body.title),
      (author = req.body.author),
      (genre = req.body.genre),
      (description = req.body.description),
      (rating = req.body.rating),
      (image = req.body.image),
      booksData
        .findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              title: req.body.title,
              author: req.body.author,
              genre: req.body.genre,
              description: req.body.description,
              rating: req.body.rating,
              image: req.body.image,
            },
          }
        )
        .then(() => {
          res.send();
        });
  });
  
  app.delete("/api/remove/:id", (req, res) => {
    console.log("Deleting");
    booksData.findByIdAndRemove(req.params.id)
      .then(deleteBook => {
        if (!deleteBook) {
          return res.status(404).send("Book not found");
        }
        res.json(deleteBook);
      })
      .catch(error => {
        console.log(error);
        res.status(500).send("Internal server error");
      });
  });
  

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
});


app.listen(PORT, ()=>{
    console.log(`Sucessfully running on port ${PORT}`);
} )