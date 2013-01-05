// Filename: views/pages/home.js

// home.js is the default opening view of 20 tiles

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/pages/home.html'
], function($, _, Backbone, HomePageTemplate){
  var HomePageView = Backbone.View.extend({
    el: $('#window'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template(HomePageTemplate, data);
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
    }
  });
  // Our module now returns our view
  return HomePageView;
});