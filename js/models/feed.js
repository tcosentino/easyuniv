// Filename: feed.js
// Purpose : feed.js is the collection structure for the app object.

define([
  'underscore',
  'backbone',
  'collections/entries'
], function(_, Backbone, Entries) {
  var FeedModel = Backbone.Model.extend({
    loadFeed: function(url, callback) {
      var that = this;
      $.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=?&q=' + encodeURIComponent(url),
        dataType: 'json',
        success: function(data) {
          that.set({
            link: data.responseData.feed.link,
            description: data.responseData.feed.description,
            title: data.responseData.feed.title,
          });
          that.entries = new Entries();
          that.entries.fromArray(data.responseData.feed.entries);
          callback("data.responseData.feed");
        }
      });
    }
  });// end UserModel
  return FeedModel;
});