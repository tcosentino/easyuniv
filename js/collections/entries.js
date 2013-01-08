// Filename: entries.js
// Purpose : entries.js is the collection structure for the app object.

define([
  'underscore',
  'backbone',
	'../models/entry'
], function(_, Backbone, Entry) {
  var EntryCollection = Backbone.Collection.extend({
    model: Entry,
    fromArray: function(entries) {
      var that = this;
      _.each(entries, function(newEntry){
        entry = new Entry(newEntry);
        that.push(entry);
      });
    }
  });
  return EntryCollection;
});