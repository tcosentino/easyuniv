// Filename: user.js
// Purpose : user.js is the model structure for the user object.

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var UserModel = Backbone.Model.extend({
    urlRoot: '/API/users',
	fetchByFBID: function(fbID, exists) {
		var that = this;
		$.ajax({url: "/API/users/fbID/"+fbID, type: 'GET', success: function(data) {
			if(data === "false") {
				exists.call(null, false);
			} else {
				that.set(JSON.parse(data));
				exists.call(null, true);
			}
		}});
	},
	initialize: function() {
		var that = this;
		this.on("change:settingsJSON", function(model){
			model.set({settings: JSON.stringify(model.get('settingsJSON'))}, {silent:true});
		});

		this.on("change:settings", function(model){
			model.set({settingsJSON: JSON.parse(model.get('settings'))}, {silent:true});
		});
	}
  });
  return UserModel;
});