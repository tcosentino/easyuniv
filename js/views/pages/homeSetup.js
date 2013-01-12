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
	var onDrop = function( event, ui ) {
		var that = this;
		
		// ID of item that was dragged
		var dragged = new HomeTile({id: ui.draggable.data('id')});
		dragged.fetch({ success: function() {
			// ID of item that was dropped into
			var dropped = new HomeTile({id: $(that).data('id')});
			dropped.fetch({ success: function() {
				console.log(dropped.toJSON());
				
				if(dragged.has('false')) { // it is a custom tile
					dragged = new HomeTile({
						text: ui.draggable.html(),
						url: ui.draggable.data('url'),
						schoolID: ui.draggable.data('schoolID')
					});
					
					dragged.save(null, {
						success: function() {
							console.log(dragged.toJSON());
							// change text/id of where it was dropped and then highlight
							$(that).html(dragged.get('text'))
								.data('id', dragged.get('id'))
								.effect('highlight');
							console.log($(that).data('id'));
						},
						error: function() { console.log('error'); }
					});
					
				} else {
					// change text/id of where it was dropped and then highlight
					$(that).html(dragged.get('text'))
						.data('id', dragged.get('id'))
						.effect('highlight');
				}
				
				if(dropped.get('schoolID') == 2) {
					
					var newGenItem = "<li class='unused-tile btn ui-draggable' data-id='" +
						dropped.get('id') + "' data-userCount='" + dropped.get('userCount') +
						"'>" + dropped.get('text') + " <span class='badge badge-success'>" +
						dropped.get('userCount') + "</span></li>";
					$(newGenItem).appendTo('ul.general').draggable({
						revert: "invalid",
						containment: $('#window'),
						scroll: false,
						helper: 'clone'
					});
					
					// Sort logic
					var ul = $('ul.general');
					var items = ul.children('li').get();
					items.sort(function(a,b){
						var keyA = $(a).data('usercount');
						var keyB = $(b).data('usercount');
		
						if (keyA < keyB) return -1;
						if (keyA > keyB) return 1;
						return 0;
					});
					items.reverse();
					$.each(items, function(i, li){
						ul.append(li);
					});
				} else {
					console.log(dropped.toJSON());
					var newItem = "<li class='unused-tile btn ui-draggable' data-id='" +
						dropped.get('id') + "' data-userCount='" + dropped.get('userCount') +
						"'>" + dropped.get('text') + " <span class='badge badge-success'>" +
						dropped.get('userCount') + "</span></li>";
					$(newItem).appendTo('ul.school').draggable({
						revert: "invalid",
						containment: $('#window'),
						scroll: false,
						helper: 'clone'
					});
										
					// Sort logic
					var ul = $('ul.school');
					var items = ul.children('li').get()
					items.sort(function(a,b){
						var keyA = $(a).data('usercount');
						var keyB = $(b).data('usercount');
		
						if (keyA < keyB) return -1;
						if (keyA > keyB) return 1;
						return 0;
					});
					items.reverse();
					$.each(items, function(i, li){
						ul.append(li);
					});
				}
				
				// remove dragged from list if it wasn't a custom tile
				if(ui.draggable.data('id') != -1)
					ui.draggable.fadeOut();
					
				$('.sortable li').droppable({
					accept: $(".draggable li"),
					drop: function(event, ui) {
						onDrop.call(this, event, ui);
					}
				});
			}});
		}});
	};
	
	var HomeSetupView = Backbone.View.extend({
		el: $('#window'),
		render: function(){
			var mod = this;
			mod.currentUser = new User();
			mod.currentUser.fetchByFBID(window.easyUserData.fbResponse.authResponse.userID, function(exists) {
				if(!exists) {
					console.log('shouldnt have gotten to this page');
				} else {
					console.log(mod.currentUser.toJSON());
					var userSchool = new School({id: mod.currentUser.get('schoolID')});
					userSchool.fetch({ success: function() {
						if(userSchool.has('false')) {
							console.log('School does not exist. Hmm..');
						} else {
							console.log(userSchool.toJSON());
							var allTiles = new HomeTiles();
							allTiles.fetch({ success: function() {
								var schoolTiles = new HomeTiles([
									allTiles.get(userSchool.get('fiveTilesArr')[0]),
									allTiles.get(userSchool.get('fiveTilesArr')[1]),
									allTiles.get(userSchool.get('fiveTilesArr')[2]),
									allTiles.get(userSchool.get('fiveTilesArr')[3]),
									allTiles.get(userSchool.get('fiveTilesArr')[4])
								]);//end schoolTiles
								var general = new School();
								general.fetchBySite('general', function(exists) {
									if(!exists) {
										console.log('WTF mate, general school doesn\'t exist');
									} else {
										var genTiles = new HomeTiles([
											allTiles.get(general.get('fiveTilesArr')[0]),
											allTiles.get(general.get('fiveTilesArr')[1]),
											allTiles.get(general.get('fiveTilesArr')[2]),
											allTiles.get(general.get('fiveTilesArr')[3]),
											allTiles.get(general.get('fiveTilesArr')[4])
										]);//end genTiles
			
										// We now have the following data that we can pass to the
										// template:
										//   schoolTiles - 5 static tiles to the users school
										//   genTiles    - 5 static tiles to all users
										//   allTiles    - all tiles - use .where({options}) to
										//                 specify which tiles need to be shown
										
										// Using Underscore we can compile our template with data

										var botTen = [], restSchool = [], restGeneral = [];
										var unusedSchool = allTiles.where({schoolID: userSchool.get('id'), standard: '0'});
										var unusedGeneral = allTiles.where({schoolID: '2', standard: '0'});
										if(unusedSchool.length >= 5) {
											botTen = botTen.concat(_.first(unusedSchool, 5),
												_.first(allTiles.where({schoolID: '2'/*general*/, standard: '0'}), 5)
											);
											restSchool = _.rest(unusedSchool, 5);
											restGeneral = _.rest(unusedGeneral, 5);
										} else {
											botTen = botTen.concat(unusedSchool,
												_.first(allTiles.where({schoolID: '2'/*general*/, standard: '0'}), 10 - unusedSchool.length)
											);
											restGeneral = _.rest(unusedGeneral, 10 - unusedSchool.length);
										}

										var data = {
											'schoolTiles': schoolTiles.models,
											'genTiles': genTiles.models,
											'botTen': botTen,
											'restSchool': restSchool,
											'restGeneral': restGeneral,
											_: _
										};
										var compiledTemplate = _.template(HomeSetupTemplate, data);
										// Append our compiled template to this Views "el"
										mod.$el.html( compiledTemplate );
										
										
										// Below is the logic for dragging and dropping and sorting everything
										$(function() {
											$(".sortable").sortable({
												grid: [ 118, 45 ],
												tolerance: "pointer",
												containment: "parent"
											});
											$(".draggable li").draggable({
												revert: "invalid",
												containment: $('#window'),
												scroll: false,
												helper: 'clone'
											});
											$('.sortable li').droppable({
												accept: $(".draggable li"),
												tolerance: "pointer",
												drop: function(event, ui) {
													onDrop.call(this, event, ui);
												}
											});
											$(".sortable").disableSelection();
											$(".draggable li").disableSelection();
										});
									}//end else
								});//end fetchBySite
							}});//end alltiles.fetch
						}//end else
					}});//end userSchool.fetch
				}
			});
			this.listeners();
		},
		listeners: function(){
			var that = this;
			// This function is called every time a 'general' textbox is clicked
			// -currently if there are 5 selected, it will disable the rest
			$("input.general:checkbox").live('click', function() {
				console.log('here');
				var bol = $("input.general:checkbox:checked").length >= 5;
				$("input.general:checkbox").not(":checked").attr("disabled",bol);
			});
			
			// This function is called every time a 'school' textbox is clicked
			// -currently if there are 5 selected, it will disable the rest
			$("input.school:checkbox").live('click', function() {
				console.log('here');
				var bol = $("input.school:checkbox:checked").length >= 5;
				$("input.school:checkbox").not(":checked").attr("disabled",bol);
			});
			
			$('#display-text').live('keyup', function(e){
				$('#custom-tile').html($(this).val());
			});
			
			$('#url-text').live('keyup', function(e){
				$('#custom-tile').data('url', $(this).val());
			});
			
			$('#school-checkbox').live('click', function(e) {
				if($(this).is(':checked')) {
					$('#custom-tile').data('schoolID', that.currentUser.get('schoolID'));
				} else
					$('#custom-tile').data('schoolID', 2);
			});
			
			$('#right_arrow').off().live('click', {view: this}, this.rightArrow);
			$('#left_arrow').off().live('click', this.leftArrow);
		},
		rightArrow: function(e){
			var user = e.data.view.currentUser;
			console.log(user.toJSON());

			var temp = user.get('settingsJSON');
			var hT = $.map($('.custom-tiles').children(), function(o){ return Number($(o).data('id')); });
			temp.homeTiles = hT;
			user.set({settings: JSON.stringify(temp)});

			console.log(user.toJSON());
			user.save();
			return false;
		},
		leftArrow: function(){
			window.location = '#/welcome';
			return false;
		}
	});
  return HomeSetupView;
  // What we return here will be used by other modules
});