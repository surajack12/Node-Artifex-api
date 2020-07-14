var express = require('express');
var app = express.Router();
var mysql = require('mysql');
var bodyParser=require('body-parser');
const {Validator} =require('node-input-validator');

var conn = mysql.createConnection({
    host:'Database.gallantfusiontech.com',
    user :'c19GFTdev',
    password:'temp1234',
    database:'c19GFT'
});
conn.connect(function(err){
    if(err)throw err;
    console.log('mysql connected')
});

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({
    extended:true,
    
}));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// var server = app.listen(3000, "127.0.0.1", function () {

//     var host = server.address().address
//     var port = server.address().port
  
//     console.log("Application listening at http://%s:%s", host, port)
  
//   });

  app.post('/contact',function(req,res){
    var postData = req.body;
    console.log(JSON.stringify(postData));
    
    const v= new Validator(req.body,{
    email:'required|email|contains:@gmail.com',
    name:'required|regex:[a-z]',
    projectType:'required',
    phoneNumber:'required|regex:[0-9]|maxLength:13',
    deviceType:'required'
    });
   
    v.check().then((match)=>{
       
        if(!match){
            
               console.log('Error in Recived data fields');
            res.status(422).send(v.errors);

        }else{
            var ideaDescription = postData.ideaDescription;
            ideaDescription=ideaDescription.trim()
            var values ='('+ mysql.escape(postData.name)+','+ mysql.escape(postData.email) +','+mysql.escape(postData.phoneNumber)+','+mysql.escape(postData.projectType)+','+mysql.escape(postData.deviceType)+','+mysql.escape(ideaDescription)+')';
           conn.query("INSERT INTO gftContact(name,email,phoneNumber,projectType,deviceType,ideaDescription) VALUES" + values,function(err,result,field){
            if(err)  res.end("{'Mysql error'}");
            res.status(200).json({ message:"Data inserted",response: true,log:result});



           });
        }
    });
});


module.exports = app;