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
		el: $('#content'),
		render: function(){
			$('.active-nav-element-text')
				.addClass('nav-element-text')
				.removeClass('active-nav-element-text');

			$('#notes-nav')
				.addClass('active-nav-element-text')
				.removeClass('nav-element-text');

			var that = this;
			if(this.currentUser == null) {
				console.log('user is not logged in');
			} else {
				that.notes = new Notes();
				console.log(that.currentUser.get('id'));
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

						$("textarea.sticky").autogrow();
						$("textarea.sticky").resize(function(){ $('#notes-list').isotope('reLayout'); });

						var keyTime = 0;
						$("textarea.sticky").keyup(function(){
							keyTime = new Date().getTime();
						});

						var saveInterval = setInterval(function(){
							if((new Date().getTime() - keyTime) > 2000 && (new Date().getTime() - keyTime) < 3000) {
								_.each(that.notes.models, function(note){
									note.set({ text: $('textarea[data-id='+note.get('id')+']').val() })
									note.save();
								});
							}
						},1000)

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
							$('#notes-list').prepend($newItem).isotope('reloadItems').isotope({sortBy: 'original-order'});
							that.notes.push(new Note());
							console.log(that.notes);
							return false;
						});
					}
				});
			}
		}
	});
	// Our module now returns our view
	return NotesPageView;
});