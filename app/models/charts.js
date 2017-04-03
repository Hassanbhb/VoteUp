const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chart = Schema({
	question: String,
	labels: [String],
	data: [Number],
	creator: String,
	voters: [String]
})

module.exports = mongoose.model('Chart', Chart);