'use strict';

const express = require('express');
const routes = require('./app/routes/routes.js'),
      mongoose = require('mongoose'),
      passport = require('passport'),
	  bodyParser = require('body-parser'),
	  session = require('express-session');

const app = express();

require('dotenv').load();

require('./app/config/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

mongoose.connection.once('open', function(){
	console.log("connection has been made (db");
}).on("error", function(err){
	console.log(err);
})

// ejs templating engine
app.set('view engine', 'ejs');
app.use('/css', express.static(process.cwd() + '/public/css'));
app.use('/img', express.static(process.cwd() + '/public/img'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/common', express.static(process.cwd() + "/app/common"));

//for the form post
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(session({
	secret: "secretVoteUp",
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
