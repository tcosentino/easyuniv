// Filename: views/pages/news.js

// news.js is the view for the news page

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/pages/news.html',
	'models/school',
	'models/user',
	'models/feed'
], function($, _, Backbone, NewsPageTemplate, School, User, Feed){
	var NewsPageView = Backbone.View.extend({
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
						if(that.currentUser.get('settingsJSON').apps[3] == 0) {
							// need to know if they came from the left or the right
							if(that.from == 'left')
								window.location = '#/notes/left';
							else
								window.location = '#/home';
						} else {
							var feed = new Feed();
							feed.loadFeed('http://rss.cnn.com/rss/cnn_topstories.rss', function(data){
								console.log(feed);
								var data = {entries: feed.entries.models};
								var compiledTemplate = _.template(NewsPageTemplate, data);
								// Append our compiled template to this Views "el"
								that.$el.html( compiledTemplate );
								that.listeners();
							});
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
				window.location = '#/home'
			}

			return false;
		},
		leftArrow: function(){
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				window.location = '#/notes/left';
			}

			return false;
		}
	});
	// Our module now returns our view
	return NewsPageView;
});