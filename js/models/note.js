// Filename: note.js
// Purpose : note.js is the collection structure for the app object.

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
	var NoteModel = Backbone.Model.extend({
		urlRoot: 'API/notes',
		defaults: {
			text: 'Empty'
		}
	});
	return NoteModel;
});