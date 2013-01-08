// Filename: app.js
// Purpose : app.js is the model structure for the app object.

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var AppModel = Backbone.Model.extend({
    urlRoot: '/API/apps'
  });// end UserModel
  return AppModel;
});