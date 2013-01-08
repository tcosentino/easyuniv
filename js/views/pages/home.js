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
		el: $('#window'),
		render: function(){
			var mod = this;
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				var school = new School();
				school.fetchBySite(window.easyUserData.site, function(exists){
					var allTiles = new HomeTiles();
					allTiles.fetch({ success: function(){
						var botTen = [];
						var unusedSchool = allTiles.where({schoolID: school.get('id'), standard: '0'});
						var unusedGeneral = allTiles.where({schoolID: '2', standard: '0'});
						if(unusedSchool.length >= 5) {
							botTen = botTen.concat(_.first(unusedSchool, 5),
								_.first(allTiles.where({schoolID: '2'/*general*/, standard: '0'}), 5)
							);
						} else {
							botTen = botTen.concat(unusedSchool,
								_.first(allTiles.where({schoolID: '2'/*general*/, standard: '0'}), 10 - unusedSchool.length)
							);
						}
						var tiles = [];
						tiles = tiles.concat(allTiles.where({schoolID: school.get('id'), standard: '1'}),
							allTiles.where({schoolID: '2'/*general*/, standard: '1'}), botTen);
						var data = {tiles: tiles};
						var compiledTemplate = _.template(HomePageTemplate, data);
						// Append our compiled template to this Views "el"
						mod.$el.html( compiledTemplate );
					}});
				});
				console.log('not logged in');
			} else {
				// Logged in
				mod.currentUser = new User();
				mod.currentUser.fetchByFBID(window.easyUserData.fbResponse.authResponse.userID, function(exists) {
					if(!exists) {
						console.log('User does not exist. We have a problem...');
					} else {
						var userSchool = new School({id: mod.currentUser.get('schoolID')});
						userSchool.fetch({ success: function() {
							if(userSchool.has('false')) {
								console.log('School does not exist. Hmm..');
							} else {
								var general = new School();
								general.fetchBySite('general', function(exists) {
									if(!exists) {
										console.log('WTF mate, general school doesn\'t exist');
									} else {
										// We now have the following data:
										//   mod.currentUser - the current logged in user
										//   userSchool      - the school object that the user belongs to
										//   general         - the school object that holds top general tiles

										var tileIDs = [];
										var tiles = [];
										tileIDs = tileIDs.concat(general.toJSON().fiveTilesArr,
											userSchool.toJSON().fiveTilesArr,
											mod.currentUser.get('settingsJSON').homeTiles);

										var sendRender = _.after(tileIDs.length, function() {
											var data = {tiles: tiles};
											var compiledTemplate = _.template(HomePageTemplate, data);
											// Append our compiled template to this Views "el"
											mod.$el.html( compiledTemplate );
											mod.listeners();
										});

										tiles = tileIDs.map(function(id) {
											var tile = new HomeTile({id: id});
											tile.fetch({success: sendRender});
											return tile;
										});
									}
								});
							}
						}});
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
	return HomePageView;
});