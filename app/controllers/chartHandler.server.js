"use strict";

const Charts = require('../models/charts.js');
const functions = require('../common/functions.js');

function chartHandler(){
	//get charts the user created
	this.getUserCharts = function(req, res){
		Charts
			.find({"creator": functions.userName(req.user)}, {"_id": false})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				res.render("user-polls", {data: result});
			})
	}

	//get all charts and display them in polls page
	this.getAllCharts = function(req, res){
		Charts
			.find({}, {"_id": false})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				res.render("polls", {data: result, user: req.user});
			})
	}

	//get document with the question the user selected
	this.getChart = function(req, res){
		let q = req.params.question + "?"; 
		
		Charts
			.findOne({"question": q}, {"_id": false})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				
				if (result !== null) {
					//send the chart data and the username for the delete button
					res.render("view-poll", { chart: result, user: functions.userName(req.user) });
				}else{
					res.send({
						"error": "sorry, your question must have just one question mark, or something went wrong."
					});
				}
			})
	}

	//update the chart when user votes
	this.updateChart = function(req, res){
		const q = req.params.question+"?";
		//get index from the post req url
		const v = req.query.index;
		const option = {};
		option["data."+ v] = 1;
		//first get the chart the user is trying to vote on
		Charts
			.findOne({"question": q}, {"_id": false})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				const voterId = functions.userId(req.user);
				//check if document is found
				if (result !== null) {
					//check if the users name is not in the voters array, meaning he never voted
					if (result.voters.indexOf(voterId) === -1) {
						//update charts option and add user to voters array
						Charts
							//increment the option data by 1 (the lebels have the same index as their data)
							//push voters name to voters array
							.findOneAndUpdate({"question": q}, { $inc: option, $push: { voters: voterId } })
							.exec(function(err, result){
								if (err) {return err};
								if (result !== null) {
									console.log("voters array updated")
									res.send(result);
								}else{
									console.log("fail "+result);
									res.send('error');
								}
							})

					}else{
						//if user is in voters array don't count his vote and tell him to try another chart
						res.send({
							"error": "you have already voted"
						});
						console.log("you have already voted: "+ voterId );

					}
					
				}else{
					res.send({
						"error": "opps, something wrong happened"
					})
				}
			})		
	};

	this.createNewChart = function(req, res){
		
		if (req.body.question.indexOf('?') !== -1) {
			//create arrays to save in the document
			let labelsArr = [];
			let dataArr = [];
			for (var i = 0; i < req.body.options.length; i++) {
				labelsArr.push(req.body.options[i]["option"]);
				dataArr.push(0);
			}
			
			const NewChart = new Charts({
				question: req.body.question,
				labels: labelsArr,
				data: dataArr,
				creator: functions.userName(req.user)
			});

			//save doc then redirect to doc page
			NewChart.save(function(err, data){
				if (err) {return console.log(err)};
				res.redirect('/view-poll/'+req.body.question);
			});
		}else{
			res.send({
						"error": "sorry, your question must have just one question mark."
					});
		}
		
	}

	this.deleteChart = function(req, res){
		const q = req.params.question +"?";
		Charts
			.findOneAndRemove({"question": q})
			.exec(function(err, data){
				res.send(data);
			})
	}
}

module.exports = chartHandler;