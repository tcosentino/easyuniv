// Filename: views/header.js

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/header.html'
], function($, _, Backbone, HeaderTemplate){
  var HeaderView = Backbone.View.extend({
    el: $('#header'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template(HeaderTemplate, data);
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
    }
  });
  // Our module now returns our view
  return HeaderView;
});