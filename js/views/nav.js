// Filename: nav.js

define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/nav.html',
	'models/user'
], function($, _, Backbone, NavTemplate, User){
	var SettingsView = Backbone.View.extend({
		el: $('#main-nav'),
		render: function(){

			if(this.currentUser == null) {
				// not logged in
				// display the login button
			} else {
				var data = { user: this.currentUser };
				console.log(data.user);
				var compiledTemplate = _.template(NavTemplate, data);
				// Append our compiled template to this Views "el"
				this.$el.html( compiledTemplate );

				$('.nav-element-text').live('click', function() {
					$('.active-nav-element-text')
						.addClass('nav-element-text')
						.removeClass('active-nav-element-text');

					$(this)
						.addClass('active-nav-element-text')
						.removeClass('nav-element-text');
				});
			}

		}
	});
	// Our module now returns our view
	return SettingsView;
});