// Filename: views/leftRight.js

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/leftRight.html'
], function($, _, Backbone, LeftRightTemplate){
  var RightView = Backbone.View.extend({
    el: $('#right'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {"dir": 'right'};
      var compiledTemplate = _.template(LeftRightTemplate, data);
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
    }
  });
  // Our module now returns our view
  return RightView;
});