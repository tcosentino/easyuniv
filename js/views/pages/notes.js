// Filename: views/pages/notes.js

// notes.js is the view for the notes page

define([
	'jquery',
	'underscore',
	'backbone',
	'expand',
	'text!templates/pages/notes.html',
	'models/school',
	'models/user',
	'collections/notes',
	'models/note'
], function($, _, Backbone, Expand, NotesPageTemplate, School, User, Notes, Note){
	var NotesPageView = Backbone.View.extend({
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
						if(that.currentUser.get('settingsJSON').apps[2] == 0) {
							// need to know if they came from the left or the right
							if(that.from == 'left')
								window.location = '#/home';
							else
								window.location = '#/news/right';
						} else {
							that.notes = new Notes();
							that.notes.getUserNotes(that.currentUser.get('id'), function(worked){
								if(!worked){
									console.log('something went wrong');
								} else {
									console.log(that.notes);
									var data = { notes: that.notes.models };
									var compiledTemplate = _.template(NotesPageTemplate, data);
									// Append our compiled template to this Views "el"
									that.$el.html( compiledTemplate );
									that.listeners();
								}
							});
						}
					}
				});
			}
			this.listeners();
		},
		listeners: function(){
			var that = this;
			console.log(that);

			$("textarea.sticky").autogrow();

			$('#new-note').live('click', function(e){
				var newNote = new Note({userID: that.currentUser.get('id')});
				newNote.save({
					success: function() {
						that.notes.push(newNote);
						console.log(that.notes);
					}
				});
				$('#notes-list').append('<li><textarea data-id="'+newNote.get('id')+'" class="sticky" maxlength="300" >Enter your note here! It will save when you change the page!</textarea></li>');
				that.notes.push(new Note());
				console.log(that.notes);
				return false;
			});
			
			$('#right_arrow').off().click({view: that}, this.rightArrow);
			$('#left_arrow').off().click({view: that}, this.leftArrow);
		},
		rightArrow: function(e){
			var that = e.data.view;
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				_.each(that.notes.models, function(note){
					note.set({ text: $('textarea[data-id='+note.get('id')+']').val() })
					note.save();
				});
				window.location = '#/news/right';
			}

			return false;
		},
		leftArrow: function(){
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				window.location = '#/home';
			}

			return false;
		}
	});
	// Our module now returns our view
	return NotesPageView;
});