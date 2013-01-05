// Filename: router.js

// router.js handles the switching between apps/pages using urls

define([
  'jquery',
  'underscore',
  'backbone',
  'views/pages/home',
  'views/pages/login',
  'views/pages/newUser',
  'views/pages/homeSetup',
  'views/header',
  'views/left',
  'views/right'
], function($, _, Backbone, HomePageView, LoginPageView, NewUserView, 
			HomeSetupView, HeaderView, LeftView, RightView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Home is the default page when nothing is entered
      // but will also work if /home is typed in
      ''     : 'showHome',
      'home' : 'showHome',

      // Login is a simple screen that will allow the user to
      // login with facebook. At some point the option to create
      // an account will be added to this page as well
      'login' : 'showLogin',
	  
			// These are the views that a user will see when they create
			// an account with easyUniv. It is sort of a 'getting started'
			'welcome'   : 'showNewUser',
			'homeSetup' : 'showHomeSetup',

      // Default - *actions makes a variable out of the route
      '*actions': 'defaultAction'
    }
  });
  
  var commonViews = function(){
	// Create instances of each common view
	var headerView = new HeaderView();
	var leftView = new LeftView();
	var rightView = new RightView();
	
	// Render each of the common views
	headerView.render();
	leftView.render();
	rightView.render();
  }

  var initialize = function(){
    var router = new AppRouter;

    router.on('route:showHome', function(){
      commonViews();

      // Call render on the module we loaded in via the dependency array
      // 'views/pages/home'
      var homePageView = new HomePageView();
      homePageView.render();
    });

    router.on('route:showLogin', function(){
      commonViews();
	  
      // Show the login page
      var loginPageView = new LoginPageView();
      loginPageView.render();
    });
	
		router.on('route:showNewUser', function(){
			commonViews();
			
			// Show the newUser page
			var newUserView = new NewUserView();
			newUserView.render();
		});
		
		router.on('route:showHomeSetup', function(){
			commonViews();
			
			var homeSetupView = new HomeSetupView();
			homeSetupView.render();
		});

    // for now, just give an error in the console
    //  TODO: figure out what to do when something else is answered 
    router.on('route:defaultAction', function(actions){
      // We have no matching route, lets just log what the URL was
      console.log('No route:', actions);
    });
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});