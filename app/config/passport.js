"use strict";

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/users.js');
const configAuth = require('./auth');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(null, user);
		})
	});

	//******** facebook strategy ********//
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL,
		profileFields: ['id', 'name']
	},
	function(accessToken, refreshToken, profile, done){
		process.nextTick(function(){
			User.findOne({"facebook.id": profile.id}, function(err, user){
				if (err) {return done(err)};
				if (user) {
					return done(null, user);
				}else{
					const newFacebookUser = new User();

					newFacebookUser.facebook.id = profile.id;
					newFacebookUser.facebook.token = profile.token;
					newFacebookUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
					
					newFacebookUser.save(function(err){
						if (err) {throw err};
						return done(null, newFacebookUser);
					})
				}
			})
		})
	}));

	//********** google Strategy *********//

	passport.use(new GoogleStrategy({
		clientID: configAuth.googleAuth.clientID,
		clientSecret: configAuth.googleAuth.clientSecret,
		callbackURL: configAuth.googleAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done){
	  	process.nextTick(function(){
	  		User.findOne({"google.id": profile.id}, function(err, user){
	  			if (err) {return done(err)};
	  			if (user) {
	  				return done(null, user);
	  			}else{
	  				const newGoogleUser = new User();
	  			
	  				newGoogleUser.google.id = profile.id;
	  				newGoogleUser.google.token = accessToken;
	  				newGoogleUser.google.name = profile.displayName;

	  				newGoogleUser.save(function(err){
	  					if (err) { throw err};
	  					return done(null, newGoogleUser);
	  				})
	  			}
	  		})
	  	})
	  }

	))

	//************* github strategy **********//

	passport.use(new GithubStrategy({
	    clientID: configAuth.githubAuth.clientID,
	    clientSecret: configAuth.githubAuth.clientSecret,
	    callbackURL: configAuth.githubAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    process.nextTick(function(){
	    	User.findOne({"github.id": profile.id}, function(err, user){
	    		if (err) {return done(err)};
	    		if (user) {
	    			return done(null, user);
	    		}else{
	    			const newGithubUser = new User();
	    		
	    			newGithubUser.github.id = profile.id;
	    			newGithubUser.github.token = accessToken;
	    			newGithubUser.github.name = profile.displayName;

	    			newGithubUser.save(function(err){
	    				if(err){ throw err };
	    				return done(null, newGithubUser);
	    			})
	    		}
	    	})
	    })
	  }
	));

	//************ twitter strategy *************//

	passport.use(new TwitterStrategy({
	    consumerKey: configAuth.twitterAuth.consumerKey,
	    consumerSecret: configAuth.twitterAuth.consumerSecret,
	    callbackURL: configAuth.twitterAuth.callbackURL
	  },
	  function(token, tokenSecret, profile, done) {
	    process.nextTick(function(){
	    	User.findOne({"twitter.id": profile.id}, function(err, user){
	    		if (err) {return done(err)};
	    		if (user) {
	    			return done(null, user);
	    		}else{
	    			const newTwitterUser = new User();
	    			
	    			newTwitterUser.twitter.id = profile.id;
	    			newTwitterUser.twitter.token = token;
	    			newTwitterUser.twitter.name = profile.displayName;

	    			newTwitterUser.save(function(err){
	    				if(err){ throw err };
	    				return done(null, newTwitterUser);
	    			})
	    		}
	    	})
	    })
	  }
	));
}