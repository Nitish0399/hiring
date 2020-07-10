var express = require("express");
var app = express();
var port = 3000;
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({ storage: storage });

app.use(express.static('static'));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post('/submitApplication', upload.single('resume'), function(req, res) {

  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017';

  var name = req.body.fullName;
  var email = req.body.emailId;
  var position = req.body.position;
  var qualification = req.body.qualification;
  var resume = req.file;

  var data = {
      "name": name,
      "email":email,
      "position":position,
      "qualification":qualification,
      "resume":resume
  }

  MongoClient.connect(url, function(err, client) {
      var db = client.db('hiring');
      db.collection('applications').insertOne(data,function(err, collection){
              if (err) throw err;
              console.log("Record inserted Successfully");
          });

  });
  res.send('Succefully Applied');
});



app.listen(port, () => {
  console.log("Server listening on port " + port);
});
