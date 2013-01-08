// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent further along in the tutorial.
require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },
  paths: {
    jquery: '../lib/jQuery/jquery',
    underscore: '../lib/Underscore/underscore',
    backbone: '../lib/Backbone/backbone',
		jqueryui: '../lib/jQuery-UI/js/jquery-ui.min',
    expand: '../lib/expand',
    templates: '../templates',
		models: 'models',
		views: 'views',
		collections: 'collections',
	bootstrap: '../lib/Bootstrap/js/bootstrap.min.js'
  }

});

require([
  // Load our app module and pass it to our definition function
  'app',
], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});