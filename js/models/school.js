// Filename: school.js
// Purpose : school.js is the model structure for the school object.

define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var SchoolModel = Backbone.Model.extend({
    urlRoot: '/API/schools',
	fetchBySite: function(site, exists) {
		var that = this;
		$.ajax({url: "/API/schools/site/"+site, type: 'GET', success: function(data) {
			if(data === "false") {
				exists.call(null, false);
			} else {
				that.set(JSON.parse(data));
				exists.call(that, true);
			}
		}});//end ajax
	},
	initialize: function() {
		this.on("change:fiveTiles", function(model){
			model.set({fiveTilesArr: JSON.parse(model.get('fiveTiles'))});
		});
	}
  });// end UserModel
  return SchoolModel;
});