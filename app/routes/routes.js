const path = process.cwd();
const ChartHandler = require(path + '/app/controllers/chartHandler.server.js');

module.exports = function(app, passport){

	function isLoggedIn(req, res, next){
		if (req.isAuthenticated()) {
			return next();
		}else{
			res.redirect('/login');
		}
	}

	app.route("/")
		.get(function(req, res){
			res.render("home");
		});

	

	app.route('/new-poll')
		.get(isLoggedIn , function(req, res){
			res.render("new-poll");
		})

	app.route('/login')
		.get(function(req, res){
			res.render("login");
		})

	app.route('/logout')
		.get(function(req, res){
			req.logout();
			res.redirect('/login');
		})	

	const chartHandler = new ChartHandler();

	app.route("/user-polls")
		.get(isLoggedIn, chartHandler.getUserCharts);

	app.route('/new-poll/new')
		.post(isLoggedIn, chartHandler.createNewChart);

	app.route('/view-poll/:question')
		.get(chartHandler.getChart)
		.post(isLoggedIn, chartHandler.updateChart)
		.delete(isLoggedIn, chartHandler.deleteChart);

	app.route('/polls')
		.get(chartHandler.getAllCharts);

	//redirect user to facebook for authentication, then redirect user to
	// auth/facebook/callback	
	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));

	//if access was granted redirect to polls else authentication failed then redirect to login page
	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', { successRedirect: '/polls',
												 failureRedirect: "/login"}));

	app.route('/auth/google')
		.get(passport.authenticate('google', {scope: [ 'https://www.googleapis.com/auth/plus.login',
  													   , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }));	

	app.route('/auth/google/callback')
		.get(passport.authenticate('google', { successRedirect: "/polls",
											   failureRedirect: "/login" }));

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', { failureRedirect: "/login" }),
			function(req, res){
				res.redirect('/polls');
			});	

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', { failureRedirect: "/login" }),
			function(req, res){
				res.redirect('/polls');
			});	
}