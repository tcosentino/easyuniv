// Filename: views/pages/notes.js

// notes.js is the view for the notes page

define([
	'jquery',
	'underscore',
	'backbone',
	'expand',
	'isotope',
	'resize',
	'text!templates/pages/notes.html',
	'models/school',
	'models/user',
	'collections/notes',
	'models/note'
], function($, _, Backbone, Expand, Isotope, Resize, NotesPageTemplate, School, User, Notes, Note){
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
								window.location = '#/sports/left';
							else
								window.location = '#/home';
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
									$('#notes-list').isotope();
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

			$("textarea.sticky").resize(function(){
				$('#notes-list').isotope('reLayout');
			});

			$('.remove-sticky').off().live('click', function(e){
				var delNote = new Note({id: $(this).data('id')});
				delNote.destroy();
				//$(this).parent().parent().hide('scale', {percent: 0}, 500);
				$('#notes-list').isotope('remove', $(this).parent().parent());
				return false;
			});

			$('#new-note').off().click(function(e){
				var newNote = new Note({userID: that.currentUser.get('id')});
				newNote.save({
					success: function() {
						that.notes.push(newNote);
						console.log(that.notes);
					}
				});
				var $newItem = $('<div class="sticky"><div class="text-right"><a href="#"" class="remove-sticky" data-id="'+newNote.get('id')+'"><i class="icon-remove"></i></a></div><textarea data-id="'+newNote.get('id')+'" class="sticky" maxlength="300" >Enter your note here! It will save when you change the page!</textarea></div>');
				$('#notes-list').isotope('insert', $newItem);
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
				window.location = '#/home';
			}

			return false;
		},
		leftArrow: function(){
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				window.location = '#/sports/left';
			}

			return false;
		}
	});
	// Our module now returns our view
	return NotesPageView;
});