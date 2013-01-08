// Filename: settings.js

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/pages/settings.html',
	'models/app',
	'collections/apps',
	'models/user'
], function($, _, Backbone, SettingsTemplate, App, Apps, User){
	var SettingsView = Backbone.View.extend({
		el: $('#window'),
		render: function(){
			var that = this;

			this.currentUser = new User();
			this.currentUser.fetchByFBID(window.easyUserData.fbResponse.authResponse.userID, function(exists) {
				if(!exists) {
					console.log('problem');
				} else {
					// Using Underscore we can compile our template with data
					that.apps = new Apps();
					that.apps.fetch({success: function(){
						_.each(that.apps.models, function(app){
							app.set({ checked: that.currentUser.get('settingsJSON').apps[app.get('id')]});
						});
						var data = { apps: that.apps.models, _:_ };
						var compiledTemplate = _.template(SettingsTemplate, data);
						// Append our compiled template to this Views "el"
						that.$el.html( compiledTemplate );
					}});
				}
			});

			this.listeners();
		},
		listeners: function(){
			var that = this;
			
			$('#right_arrow').off().live('click', {view: this}, this.rightArrow);
			$('#left_arrow').off().live('click', this.leftArrow);
		},
		rightArrow: function(e){
			var that = e.data.view;
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
				var appsEnabled = {};
				_.each(that.apps.models, function(app) {
					if($('input[data-appid=' + app.get('id') + ']').is(':checked'))
						appsEnabled[app.get('id')] = 1;
					else
						appsEnabled[app.get('id')] = 0;
				});
				var temp = that.currentUser.get('settingsJSON')
				temp.apps = appsEnabled;
				that.currentUser.set({settings: JSON.stringify(temp)});
				console.log(that.currentUser.get('settings'));
				that.currentUser.save();
			}

			return false;
		},
		leftArrow: function(){
			if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
				// Not logged in
				window.location = '#/login';
			} else {
				// Logged in
			}

			return false;
		}
	});
	// Our module now returns our view
	return SettingsView;
});