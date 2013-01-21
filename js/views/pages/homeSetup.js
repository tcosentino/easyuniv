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

					$(".sortable").sortable({
						tolerance: "pointer",
						containment: "parent"
					});

					$("#custom-tile").parent().draggable({
						revert: "invalid",
						containment: $('#window'),
						helper: 'clone',
						cursorAt: {left: -290}
					});

					$('select').change(function(){
						console.log($(this).children('option:selected').data('id'));
						$('#display-text').val($(this).children('option:selected').data('text'));
						$('#url-text').val($(this).children('option:selected').data('url'));
						$('#custom-tile').html($('#display-text').val());
						$('#custom-tile').parent().data('url', $('#url-text').val());
						$('#custom-tile').parent().data('id', $(this).children('option:selected').data('id'));
					});

					$('.sortable div').droppable({
						accept: $("#custom-tile").parent(),
						tolerance: "pointer",
						drop: function(event, ui) {
							var $dragged = ui.draggable;
							var $dropped = $(this);

							$dropped.children('div').first().html($dragged.children('div').first().html());
							$dropped.data('id', $dragged.data('id'));
							$dropped.data('url', $dragged.data('url'));

							console.log($dragged.data('url'));
						}
					});

					$('#save-button').click(function(){
						var tilesToSave = 0;
						var tiles = [];
						_.each($('.sortable .tile'), function(t){
							if($(t).data('id') == -1) {
								tilesToSave += 1;
								tiles.push(new HomeTile({ 
									text: $(t).children('div').first().html(),
									url: $(t).data('url')
								}));
							} else {
								tiles.push(new HomeTile({ 
									id: $(t).data('id'),
									text: $(t).children('div').first().html(),
									url: $(t).data('url')
								}));
							}
						});

						var afterSave = _.after(tilesToSave, function(){
							console.log(tiles);
							var settings = { 
								homeTiles: $.map(tiles, function(t){ return Number(t.get('id')); })
							};
							that.currentUser.set({settings: JSON.stringify(settings)});
							that.currentUser.save(null, {
								success: function(user) { 
									//window.location = 'http://local.easyuniv.com/default.php#/home';
								}
							});
						});

						_.each(tiles, function(t){
							if(!(t.has('id'))) {
								t.save(null, { success: function(){
									afterSave();
								}});
							}
						});

						return false;
					});
			
					$('#display-text').live('keyup', function(e){
						$('#custom-tile').html($(this).val());
						$('#custom-tile').parent().data('id', '-1');
					});
					
					$('#url-text').live('keyup', function(e){
						$('#custom-tile').parent().data('url', $(this).val());
						$('#custom-tile').parent().data('id', '-1');
					});
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