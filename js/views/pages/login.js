// Filename: views/pages/login.js

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/pages/login.html',
  'models/user',
	'models/school'
], function($, _, Backbone, LoginPageTemplate, UserModel, School){
  var ProjectListView = Backbone.View.extend({
    el: $('#window'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template(LoginPageTemplate, data);
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate ); 
	  
      this.listeners();
    },
	  listeners: function(){
	    $('#login').on('click', function(e) {
        FB.login(function(response) {
					if (response.authResponse) {
						// FB.api gets information on the user from the facebook database
						// passing /me in as an argument uses the current logged in user
						FB.api('/me', function(response) {
							// Here is where we will check if the user is in our database
							var fbUser = new UserModel();
							fbUser.fetchByFBID(response.id, function(userExists){
								// If the user does not exist in the database, we need to add it
								if(!userExists){
									var school = new School();
									school.fetchBySite(window.easyUserData.site, function(exists) {
										if(!exists) {
											console.log('school doesn\'t exist.. big problem');
										} else {
											var that = this;
											var newUserData = {
												"fbID": response.id, 
												"firstName": response.first_name, 
												"lastName": response.last_name, 
												"gender": response.gender.charAt(0), 
												"email": "", // TODO: implement once email is given
												"schoolID": that.get('id')
											};
											console.log(fbUser);
											fbUser.save(newUserData, {
												success: function(user) { 
													// After a new user is created we want to send them to the
													// new user page, so they can set up their homepage as well
													// as which apps they want to enable
													window.location = 'http://local.easyuniv.com/default.php#/welcome';
												}
											});// end save
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
  return ProjectListView;
});