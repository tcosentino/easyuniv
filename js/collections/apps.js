// Filename: apps.js
// Purpose : apps.js is the collection structure for the app object.

define([
  'underscore',
  'backbone',
	'../models/app'
], function(_, Backbone, App) {
  var AppCollection = Backbone.Collection.extend({
    model: App,
	url: '/API/apps',
	comparator: function(app) {
		return 1.0 / app.get('userCount');
	}
  });
  return AppCollection;
});