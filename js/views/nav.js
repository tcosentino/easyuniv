// Filename: nav.js

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/nav.html',
	'models/user',
	'models/school',
	'collections/homeTiles'
], function($, _, Backbone, NavTemplate, User, School, HomeTiles){
	var SettingsView = Backbone.View.extend({
		el: $('#main-nav'),
		render: function(){
			var data = { user: this.currentUser };
			console.log(data.user);
			var compiledTemplate = _.template(NavTemplate, data);
			// Append our compiled template to this Views "el"
			this.$el.html( compiledTemplate );

			$('.nav-element-text').live('click', function() {
				$('.active-nav-element-text')
					.addClass('nav-element-text')
					.removeClass('active-nav-element-text');

				$(this)
					.addClass('active-nav-element-text')
					.removeClass('nav-element-text');
			});

			$('#login').off().click(function(){
        		FB.login(function(response) {
					if (response.authResponse) {
						// FB.api gets information on the user from the facebook database
						// passing /me in as an argument uses the current logged in user
						FB.api('/me', function(response) {
							// Here is where we will check if the user is in our database
							var fbUser = new User();
							fbUser.fetchByFBID(response.id, function(userExists){
								// If the user does not exist in the database, we need to add it
								if(!userExists){
									var school = new School();
									school.fetchBySite(window.easyUserData.site, function(exists) {
										if(!exists) {
											console.log('school doesn\'t exist.. big problem');
										} else {
											var that = this;
											that.tiles = new HomeTiles();
											that.tiles.fetch({ success: function() {
												var settings = { 
													homeTiles: $.map(_.first(that.tiles.where({ schoolID: '1', standard: '0' }), 10), function(t){ return Number(t.get('id')); })
												};
												console.log(JSON.stringify(settings));
												var newUserData = {
													"fbID": response.id, 
													"firstName": response.first_name, 
													"lastName": response.last_name, 
													"gender": response.gender.charAt(0), 
													"email": "", // TODO: implement once email is given
													"schoolID": that.get('id'),
													"settings": JSON.stringify(settings)
												};
												console.log(newUserData);
												fbUser.save(newUserData, {
													success: function(user) { 
														// After a new user is created we want to send them to the
														// new user page, so they can set up their homepage as well
														// as which apps they want to enable
														window.location = 'http://local.easyuniv.com/default.php#/home';
													}
												});// end save
											}});
										}// end else
									});// end fetchBySite
										  
								} else {
									// If the user already does exist we will just redirect to 
									// the homepage
									window.location = 'http://local.easyuniv.com/default.php';
								}
							});
						});
						//
					} else {
						// cancelled
					}
		        });
		        return false;
			});
		}
	});
	// Our module now returns our view
	return SettingsView;
});