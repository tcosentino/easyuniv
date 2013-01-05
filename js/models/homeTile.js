// Filename: homeTile.js
// Purpose : homeTile.js is the model structure for the homeTile object.

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var HomeTileModel = Backbone.Model.extend({
    urlRoot: '/API/hometiles',
		defaults: {
			approved: 0,
			schoolID: 2,
			standard: 0
		}
  });// end UserModel
  return HomeTileModel;
});