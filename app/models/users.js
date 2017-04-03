const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = Schema({
	facebook:{
		id: String,
		token: String,
		name: String
	},
	google:{
		id: String,
		token: String,
		name: String
	},
	github:{
		id: String,
		token: String,
		name: String
	},
	twitter:{
		id: String,
		token: String,
		name: String
	}
})

module.exports = mongoose.model('User', User);