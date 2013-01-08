// Filename: notes.js
// Purpose : notes.js is the collection structure for the note object.

define([
  'underscore',
  'backbone',
	'../models/note'
], function(_, Backbone, Note) {
  var NoteCollection = Backbone.Collection.extend({
    model: Note,
    getUserNotes: function(userID, callback){ 
      var that = this;
      $.ajax({
        url: '/API/notes/user/' + userID,
        type: 'GET',
        dataType: 'json',
        success: function(notes, textStatus, xhr) {
          _.each(notes, function(newNote){
            var note = new Note(newNote);
            that.models.push(note);
          });
          callback.call(null, true);
        },
        error: function() {
          callback.call(null, false);
        }
      });
    }
  });
  return NoteCollection;
});