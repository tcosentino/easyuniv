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
		el: $('#content'),
		render: function(){
			$('.active-nav-element-text')
				.addClass('nav-element-text')
				.removeClass('active-nav-element-text');

			$('#sports-nav')
				.addClass('active-nav-element-text')
				.removeClass('nav-element-text');

			var that = this;
			if(this.currentUser == null) {
				console.log('user is not logged in');
			} else {
				var data = {};
				var compiledTemplate = _.template(SportsPageTemplate, data);
				// Append our compiled template to this Views "el"
				that.$el.html( compiledTemplate );
				that.listeners();
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