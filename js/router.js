// Filename: router.js

// router.js handles the switching between apps/pages using urls

define([
  'jquery',
  'underscore',
  'backbone',
  'views/nav',
  'views/pages/home',
  'views/pages/login',
  'views/pages/newUser',
  'views/pages/homeSetup',
  'views/pages/sports',
  'views/pages/settings',
  'views/pages/news',
  'views/pages/notes',
  'models/user',
  'collections/apps'
], function($, _, Backbone, NavView, HomePageView, LoginPageView, NewUserView,
			HomeSetupView, SportsView, SettingsView, NewsView,
      NotesView, User, Apps){
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

      // Settings is where the user will go to edit which apps they want
      // to use as well as any other settings we may have
      'settings': 'showSettings',

      // The routes below are for various apps that we may have
      'notes': 'showNotes',
      'news': 'showNews',
      'sports': 'showSports',

			// These are the views that a user will see when they create
			// an account with easyUniv. It is sort of a 'getting started'
			'welcome'   : 'showNewUser',
			'homeSetup' : 'showHomeSetup',

      // Default - *actions makes a variable out of the route
      '*actions': 'defaultAction'
    },
    showHome: function() {
      var homePageView = new HomePageView();
      homePageView.render();
    },
    showSettings: function() {
      var settingsView = new SettingsView();
      settingsView.render();
    },
    showNews: function() {
      var newsView = new NewsView();
      newsView.currentUser = this.currentUser;
      newsView.render();
    },
    showSports: function(from) {
      var sportsView = new SportsView();
      sportsView.currentUser = this.currentUser;
      sportsView.render();
    },
    showNotes: function(from) {
      var notesView = new NotesView();
      notesView.currentUser = this.currentUser;
      notesView.render();
    },
    showLogin: function() {
      var loginPageView = new LoginPageView();
      loginPageView.render();
    },
    showNewUser: function() {
      var newUserView = new NewUserView();
      newUserView.render();
    },
    showHomeSetup: function() {
      var homeSetupView = new HomeSetupView();
      homeSetupView.render();
    },
    defaultAction: function(actions) {
      console.log('No route:', actions); 
    },
    initialize: function(options) {
      this.currentUser = options.currentUser;
      var navView = new NavView();
      navView.currentUser = this.currentUser;
      navView.render();
    }
  });

  var initialize = function(){
    var user;
    if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
      user = null;
    } else {
      user = new User();
      user.fetchByFBID(window.easyUserData.fbResponse.authResponse.userID, function(exists) {
        if(!exists) {
          console.log('user from fb doesn\'t exist in db');
          user = null;
        } else {
          console.log('user aquired');
        }
        var router = new AppRouter({currentUser: user});
        Backbone.history.start();
      });
    }
  };
  return {
    initialize: initialize
  };
});