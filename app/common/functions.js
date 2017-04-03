"use strict";

const functions = {

	userName : function(user){
		if (user) {
			const google = user.google.name;
			const facebook = user.facebook.name;
			const github = user.github.name;
			const twitter = user.twitter.name;
			//find which one the user logged in with and use it's json structure
					
			if (google) {
				return google;
			}else if(facebook){
				return facebook;
			}else if(github){
				return github;
			}else if (twitter) {
				return twitter;
			}
		}else{
			return false;
		}
	},

	userId : function(user){
		if (user) {
			const google = user.google.id;
			const facebook = user.facebook.id;
			const github = user.github.id;
			const twitter = user.twitter.id;
			//find which one the user logged in with and use it's json structure
					
			if (google) {
				return google;
			}else if(facebook){
				return facebook;
			}else if(github){
				return github;
			}else if (twitter) {
				return twitter;
			}
		}else{
			return false;
		}
		
	}
}

module.exports = functions;