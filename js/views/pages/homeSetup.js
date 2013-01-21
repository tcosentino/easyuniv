// Filename: homeSetup.js

//

define([
	// These are path alias that we configured in our bootstrap
	'jquery',     // lib/jquery/jquery
	'underscore', // lib/underscore/underscore
	'backbone',   // lib/backbone/backbone
	'jqueryui',
	'text!templates/pages/homeSetup.html',
	
	'models/homeTile',
	'collections/homeTiles',
	'models/school',
	'models/user'
], function($, _, Backbone, UI, HomeSetupTemplate, HomeTile, HomeTiles, School, User){
	var HomeSetupView = Backbone.View.extend({
		el: $('#content'),
		render: function(){
			var that = this;
			if(this.currentUser == null) {
				console.log('user is not logged in');
			} else {

				var tileIDs = [];
				var userTiles = [];
				tileIDs = JSON.parse(that.currentUser.get('settings')).homeTiles;

				var sendRender = _.after(tileIDs.length, function() {
					var data = {
						schoolTiles: that.tiles.where({ schoolID: that.currentUser.get('schoolID'), standard: '1' }),
						genTiles: that.tiles.where({ schoolID: '1', standard: '1' }),
						botTen: userTiles,
						restSchool: that.tiles.where({ schoolID: that.currentUser.get('schoolID'), standard: '0' }),
						restGeneral: that.tiles.where({ schoolID: '1', standard: '0' })
					};
					var compiledTemplate = _.template(HomeSetupTemplate, data);
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
		}
	});
	return HomeSetupView;
	// What we return here will be used by other modules
});