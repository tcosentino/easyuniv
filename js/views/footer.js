// Filename: views/footer.js

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/footer.html'
], function($, _, Backbone, FooterTemplate){
  var FooterView = Backbone.View.extend({
    el: $('#footer'),
    render: function(){
      // Using Underscore we can compile our template with data
      var data = {};
      var compiledTemplate = _.template(FooterTemplate, data);
      // Append our compiled template to this Views "el"
      this.$el.html( compiledTemplate );
    }
  });
  // Our module now returns our view
  return FooterView;
});