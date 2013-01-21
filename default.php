<?php
  if(isset($_GET['from']))
    $site = $_GET['from'];
  else
    $site = "easyzag";
  switch ($site) {
	case "easyzag":
	  //load easyzag settings
	  break;
  }

?>

<!doctype html>
<html lang="en">
  <head>
    <title><?php echo $site; ?></title>
    <link href="lib/Bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link type="text/css" rel="stylesheet" href="css/style.css">
    <link type="text/css" rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/nav.css">
    <link rel="stylesheet" type="text/css" href="css/news.css">
    <link rel="stylesheet" type="text/css" href="css/notes.css">
    <link rel="stylesheet" type="text/css" href="css/sports.css">
    <link rel="stylesheet" type="text/css" href="css/home.css">
  </head>
  <body>
    <!-- Begin facebook code -->
    <div id="fb-root"></div>
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId : '447878485261911',
          // Needs to be changed when goes to live
          channelUrl : '//local.easyuniv.com/channel.php',
          status : true,
          cookie : true,
          xfbml : true
        });

        FB.getLoginStatus(function(response) {
          // store data on the user inside of a namespace 
          // inside of the window object so it can be accessed
          // from anywhere. Use this like '$_SESSION'
          window.easyUserData = {
            fbResponse: response,
            site: <?php echo '"'.$site.'"'; ?>
          };   

          // Load the script "js/main.js" as our entry point for require 
          //
          // We do this programatically here so that the facbeook call is complete
          // before we send of anything else
          //
          // This constructs the equivelent of:
          // <script data-main="js/main" src="lib/Require/require.js">
          var script = document.createElement('script');
          script.setAttribute("data-main", "js/main");
          script.src = "lib/Require/require.js";
          document.getElementsByTagName('script')[0].parentNode.appendChild(script);
        })
      };

      (function(d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
      }(document))
    </script>
    <!--  End facebook code -->

    <div id="main-nav"></div>

    <div id='content'></div>

  </body>
</html>