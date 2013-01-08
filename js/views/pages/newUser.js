// Filename: newUser.js

// newUser.js is a view that is opened when a user creates an account
// on the site. It will serve as a welcome screen that leads into
// creating settings for the user. 

define([
  // These are path alias that we configured in our bootstrap
  'jquery',     // lib/jquery/jquery
  'underscore', // lib/underscore/underscore
  'backbone',   // lib/backbone/backbone
  'text!templates/pages/newUser.html'    
], function($, _, Backbone, NewUserTemplate){
  var NewUserView = Backbone.View.extend({
    el: $('#window'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template(NewUserTemplate, data);
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
	  
	  this.listeners();
    },
	listeners: function(){
	  $('#right_arrow').unbind().on('click', this.rightArrow);
	},
	rightArrow: function(){
		window.location = '#/homeSetup';
		return false;
	},
	leftArrow: function(){
		console.log('left arrow clicked');
		return false;
	}
  });
  return NewUserView;
  // What we return here will be used by other modules
});