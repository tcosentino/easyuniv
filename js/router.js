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
  'views/pages/sports',
  'views/header',
  'views/footer',
  'views/left',
  'views/right',
  'views/pages/settings',
  'views/pages/news',
  'views/pages/notes',
  'models/user',
  'collections/apps'
], function($, _, Backbone, HomePageView, LoginPageView, NewUserView,
			HomeSetupView, SportsView, HeaderView, FooterView, LeftView, RightView, SettingsView, NewsView,
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
      'notes/:from': 'showNotes',
      'news/:from': 'showNews',
      'sports/:from': 'showSports',

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
    showNews: function(from) {
      var newsView = new NewsView();
      newsView.from = from;
      newsView.render();
    },
    showSports: function(from) {
      var sportsView = new SportsView();
      sportsView.from = from;
      sportsView.render();
    },
    showNotes: function(from) {
      var notesView = new NotesView();
      notesView.from = from;
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
    initialize: function() {
      if(typeof window.easyUserData.fbResponse.authResponse === 'undefined') {
        this.loggedIn = false;
      } else {
        this.loggedIn = true;
        this.currentUser = new User();
        this.currentUser.fetchByFBID(window.easyUserData.fbResponse.authResponse.userID, function(exists) {
          if(!exists) {
            console.log('user does not exist');
          } else {
            console.log('user aquired');
          }
          drawConstants();
        });
      }
      var drawConstants = _.after(1, function(){
        // Create instances of each common view
        var headerView = new HeaderView();
        var footerView = new FooterView();
        var leftView = new LeftView();
        var rightView = new RightView();
        
        // Render each of the common views
        headerView.render();
        footerView.render();
        leftView.render();
        rightView.render();
      });
    },
    next: function() {
      if(!this.loggedIn) {

      } else {
        this.navigate('login', {trigger: true});
      }
    },
    back: function() {
      if(!this.loggedIn) {

      } else {
        this.navigate('login', {trigger: true});
      }
    }
  });

  var initialize = function(){
    var router = new AppRouter();

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});