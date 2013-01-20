// Filename: views/pages/news.js

// news.js is the view for the news page

define([
	'jquery',
	'underscore',
	'backbone',
	'isotope',
	'timeago',
	'text!templates/pages/news.html',
	'models/school',
	'models/user',
	'models/feed'
], function($, _, Backbone, Isotope, TimeAgo, NewsPageTemplate, School, User, Feed){
	var NewsPageView = Backbone.View.extend({
		el: $('#content'),
		render: function(){
			$('.active-nav-element-text')
				.addClass('nav-element-text')
				.removeClass('active-nav-element-text');

			$('#news-nav')
				.addClass('active-nav-element-text')
				.removeClass('nav-element-text');

			var that = this;
			if(this.currentUser == null) {
				console.log('user is not logged in');
			} else {
				var feed = new Feed();
				feed.loadFeed('http://news.yahoo.com/rss/', function(data){
					console.log(feed.entries.models);
					var data = {entries: feed.entries.models};
					var compiledTemplate = _.template(NewsPageTemplate, data);
					// Append our compiled template to this Views "el"
					that.$el.html( compiledTemplate );
					$('#article-list').imagesLoaded(function(){
						$('#article-list').isotope();
					});
				});
			}
		}
	});
	// Our module now returns our view
	return NewsPageView;
});