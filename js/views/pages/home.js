// Filename: views/pages/home.js

// home.js is the default opening view of 20 tiles

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/pages/home.html',
	'models/school',
	'models/user',
	'models/homeTile',
	'collections/homeTiles'
], function($, _, Backbone, HomePageTemplate, School, User, HomeTile, HomeTiles){
	var HomePageView = Backbone.View.extend({
		el: $('#content'),
		render: function(){
			var that = this;
			$('.active-nav-element-text')
				.addClass('nav-element-text')
				.removeClass('active-nav-element-text');

			$('#home-nav')
				.addClass('active-nav-element-text')
				.removeClass('nav-element-text');

			if(this.currentUser == null) {
				// Not logged in

				var school = new School();
				school.fetchBySite(window.easyUserData.site, function(exists){
					var tiles = [];
					tiles = tiles.concat(that.tiles.where({schoolID: school.get('id'), standard: '1'}),
						that.tiles.where({schoolID: '1'/*general*/, standard: '1'}),
						_.first(that.tiles.where({schoolID: '1'/*general*/, standard: '0'}), 10));

					var data = {tiles: tiles};
					var compiledTemplate = _.template(HomePageTemplate, data);
					// Append our compiled template to this Views "el"
					that.$el.html( compiledTemplate );
				});

				console.log('not logged in');
			} else {
				// Logged in

				var tileIDs = [];
				var userTiles = [];
				tileIDs = JSON.parse(that.currentUser.get('settings')).homeTiles;

				var sendRender = _.after(tileIDs.length, function() {
					var tiles = [];
					tiles = tiles.concat(
						that.tiles.where({ schoolID: that.currentUser.get('schoolID'), standard: '1' }),
						that.tiles.where({ schoolID: '1', standard: '1' }),
						userTiles
					);
					var data = {tiles: tiles};
					var compiledTemplate = _.template(HomePageTemplate, data);
					// Append our compiled template to this Views "el"
					that.$el.html( compiledTemplate );
					that.listeners();
				});

				userTiles = tileIDs.map(function(id) {
					var tile = new HomeTile({id: id});
					tile.fetch({success: sendRender});
					return tile;
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
				window.location = '#/news/right'
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
	return HomePageView;
});