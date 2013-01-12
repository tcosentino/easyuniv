// Filename: views/pages/sports.js

// sports.js is the view for the sports page

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/pages/sports.html',
	'models/school',
	'models/user'
], function($, _, Backbone, SportsPageTemplate, School, User){
	var SportsPageView = Backbone.View.extend({
		el: $('#window'),
		render: function(){
			var that = this;
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				that.currentUser = new User();
				that.currentUser.fetchByFBID(window.easyUserData.fbResponse.authResponse.userID, function(exists) {
					if(!exists) {
						console.log('something went wrong');
					} else {
						if(that.currentUser.get('settingsJSON').apps[4] == 0) {
							// need to know if they came from the left or the right
							if(that.from == 'left')
								window.location = '#/news/left';
							else
								window.location = '#/notes/right';
						} else {
							var data = {};
							var compiledTemplate = _.template(SportsPageTemplate, data);
							// Append our compiled template to this Views "el"
							that.$el.html( compiledTemplate );
							that.listeners();
						}
					}
				});

			}
		},
		listeners: function(){
			var that = this;
			console.log(that);
			
			$('#right_arrow').off().click({view: that}, this.rightArrow);
			$('#left_arrow').off().click({view: that}, this.leftArrow);
		},
		rightArrow: function(e){
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				window.location = '#/notes/right'
			}

			return false;
		},
		leftArrow: function(){
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				window.location = '#/news/left';
			}

			return false;
		}
	});
	// Our module now returns our view
	return SportsPageView;
});