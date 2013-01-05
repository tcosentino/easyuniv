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
			this.on("change:settingsJSON", function(model){
				model.set({settings: JSON.stringify(model.get('settingsJSON'))});
			});
		}
  });
  return UserModel;
});