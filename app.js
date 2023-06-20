//jshind esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// //To use css and another images that we've added in signup.html we 've to use -->
app.use(express.static("public"));  //public is a folder in which our css and other images are stored
app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});
// using app.post and bodyParser to render what we've entred on signup page
app.post("/", function(req, res){
   const firstName  = req.body.fName;
   const lastName = req.body.lName;
   const email = req.body.ema;
   
   //let us create the data that we want to send to mailchimp 
   //see list/audience section there and we can see members and see type of memebers and create the JS object for that--> members: [{}],
   //array , now members me we've email_address, status, mergeFields , etc
    const data ={
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    //convert the data into JSON format
    const jsonData = JSON.stringify(data);
    //Now by https module send that data to the mailchimp's server
    //for that we need url our api key and code
    //now format of https request send method is https.request(url, options, fn)  so let us achieve this

    const url = "https://us14.api.mailchimp.com/3.0/lists/a09cdf9a40";
    //for options if we see https module we need to post so there is method section so we've to create that
    const options = {
        method : "POST",
        auth : "RutikJ9284:577da617805fa60164a41393e69e73a6-us14"
    }
    //for syntax see https node module and stack overflow--> how to send data to api (how to made https request)
    const request = https.request(url, options, function(response){
        //if status code is 200 then success so we'll render success.html or otherwise failure.html
       if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
       }else{
        res.sendFile(__dirname + "/failure.html");
       }
        response.on("data", function(data){
           console.log(JSON.parse(data)); 
        })
    });

    request.write(jsonData);
    request.end();

});

//After clicking on try again we go to home page -->(see failure.html button has action ="/failure" and method post); imp**
app.post("/failure", function(req,res){
    res.redirect("/");
})
//Now after getting everything right --> we'll deploy our app on heroku's server 
// to deploy on heroku -->process.env.PORT
app.listen(process.env.PORT || 5000, function(){
    console.log("5000");
});
//Now app can run on herokus server and localhost5000 also works.
//Now we've to create a Procfile



// 577da617805fa60164a41393e69e73a6-us14

// a09cdf9a40.