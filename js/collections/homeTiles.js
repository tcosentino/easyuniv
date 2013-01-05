// Filename: homeTiles.js
// Purpose : homeTiles.js is the collection structure for the homeTile object.

define([
  'underscore',
  'backbone',
	'../models/homeTile'
], function(_, Backbone, HomeTile) {
  var HomeTileCollection = Backbone.Collection.extend({
    model: HomeTile,
		url: '/API/hometiles',
		comparator: function(tile) {
			return 1.0 / tile.get('userCount');
		}
  });// end HomeTileCollection
  return HomeTileCollection;
});