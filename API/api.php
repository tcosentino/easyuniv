<?php
  require '../lib/Slim/Slim.php';
  \Slim\Slim::registerAutoloader();

  $api = new \Slim\Slim();

  //--easySites-----------------------------//
  //----apps--------------------------------//
  $api->get('/apps', function(){ getTable('easysites', 'app'); });
  //----notes-------------------------------//
  $api->get('/notes', function(){ getTable('easysites', 'note'); });
  $api->get('/notes/:id', function($id){ getRowByID('easysites', 'note', $id); });
  $api->get('/notes/user/:id', function($id){ getRowsByOther('easysites', 'note', 'userID', $id); });
  $api->post('/notes', 'addNote');
  $api->put('/notes/:id', 'updateNote');
  $api->delete('/notes/:id', function($id){ deleteRowByID('easysites', 'note', $id); });
  //----users-------------------------------//
  $api->get('/users', function(){ getTable('easysites', 'user'); });
  $api->get('/users/:id', function($id){ getRowByID('easysites', 'user', $id); });
  $api->get('/users/fbID/:fbID', function($fbID){ getRowByOther('easysites', 'user', 'fbID', $fbID); });
  $api->put('/users/:id', 'updateUser');
  $api->post('/users', 'addUser');
	//----schools-----------------------------//
	$api->get('/schools', function(){ getTable('easysites', 'school'); });
	$api->get('/schools/:id', function($id){ getRowByID('easysites', 'school', $id); });
  $api->get('/schools/site/:site', function($site){ getRowByOther('easysites', 'school', 'site', $site); });
	//----homeTiles---------------------------//
	$api->get('/hometiles', function(){ getTable('easysites', 'homeTile'); });
	$api->get('/hometiles/:id', function($id){ getRowByID('easysites', 'homeTile', $id); });
	$api->post('/hometiles', 'addHomeTile');
  //--Alcapp--------------------------------//
  //----types-------------------------------//
  $api->get('/types', function(){ getTable('alcapp', 'type'); });
  $api->get('/types/:id', function($id){ getRowByID('alcapp', 'type', $id); });
  $api->post('/types', 'addType');
  $api->delete('/types/:id', 'deleteType');
  //----brands-------------------------------//
  $api->get('/brands', function(){ getTable('alcapp', 'brand'); });
  $api->get('/brands/:id', function($id){ getRowByID('alcapp', 'brand', $id); });
  $api->post('/brands', 'addBrand');
  $api->delete('/brands/:id', 'deleteBrand');
  //----sizes-------------------------------//
  $api->get('/sizes', function(){ getTable('alcapp', 'size'); });
  $api->get('/sizes/:id', function($id){ getRowByID('alcapp', 'size', $id); });
  $api->post('/sizes', 'addSize');
  $api->delete('/sizes/:id', 'deleteSize');

  $api->run();

  /* ---------------------------------------functions--------------------------------------- */

  function addUser() {
    $request = \Slim\Slim::getInstance()->request();
    $user = json_decode($request->getBody());
    $sql = "INSERT INTO user (fbID, firstName, lastName, gender, email, schoolID, settings) VALUES (:fbID, :firstName, :lastName, :gender, :email, :schoolID, :settings)";
    try {
      $db = getConnection("easysites");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("fbID", $user->fbID);
      $stmt->bindParam("firstName", $user->firstName);
      $stmt->bindParam("lastName", $user->lastName);
      $stmt->bindParam("gender", $user->gender);
      $stmt->bindParam("email", $user->email);
      $stmt->bindParam("schoolID", $user->schoolID);
      $stmt->bindParam("settings", $user->settings);
      $stmt->execute();
      $db = null;
      echo json_encode($user);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  function addNote() {
    $request = \Slim\Slim::getInstance()->request();
    $note = json_decode($request->getBody());
    $sql = "INSERT INTO note (userID, text) VALUES (:userID, :text)";
    try {
      $db = getConnection("easysites");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("userID", $note->userID);
      $stmt->bindParam("text", $note->text);
      $stmt->execute();
      $db = null;
      echo json_encode($note);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }
	
	function updateUser($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $user = json_decode($body);
    $sql = "UPDATE user SET fbID=:fbID, firstName=:firstName, lastName=:lastName, gender=:gender, email=:email, schoolID=:schoolID, settings=:settings WHERE id=:id";
    try {
			$db = getConnection("easysites");
			$stmt = $db->prepare($sql);
      $stmt->bindParam("fbID", $user->fbID);
      $stmt->bindParam("firstName", $user->firstName);
      $stmt->bindParam("lastName", $user->lastName);
      $stmt->bindParam("gender", $user->gender);
      $stmt->bindParam("email", $user->email);
      $stmt->bindParam("schoolID", $user->schoolID);
      $stmt->bindParam("settings", $user->settings);
			$stmt->bindParam("id", $id);
			$stmt->execute();
			$db = null;
			echo json_encode($user);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	}
  
  function updateNote($id){
    $request = \Slim\Slim::getInstance()->request();
    $body = $request->getBody();
    $note = json_decode($body);
    $sql = "UPDATE note SET userID=:userID, text=:text WHERE id=:id";
    try {
      $db = getConnection("easysites");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("userID", $note->userID);
      $stmt->bindParam("text", $note->text);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      $db = null;
      echo json_encode($note);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  /* addType creates a type entry in the database
   * @requestBody: {"name": "test"}
   */
  function addType() {
  	$request = \Slim\Slim::getInstance()->request();
    $type = json_decode($request->getBody());
    $sql = "INSERT INTO type (name) VALUES (:name)";
    try {
      $db = getConnection("alcapp");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("name", $type->name);
      $stmt->execute();
      $type->id = $db->lastInsertId();
      $db = null;
      echo json_encode($type);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }
	
  function addHomeTile() {
  	$request = \Slim\Slim::getInstance()->request();
    $type = json_decode($request->getBody());
    $sql = "INSERT INTO homeTile (text, url, schoolID, approved) VALUES (:text, :url, :schoolID, :approved)";
    try {
      $db = getConnection("easysites");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("text", $type->text);
      $stmt->bindParam("url", $type->url);
      $stmt->bindParam("schoolID", $type->schoolID);
      $stmt->bindParam("approved", $type->approved);
      $stmt->execute();
      $type->id = $db->lastInsertId();
      $db = null;
      echo json_encode($type);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  /* deleteType deletes a type
   */
  function deleteType($id) {
  	$sql = "DELETE FROM type WHERE id=:id";
    try {
      $db = getConnection("alcapp");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      $db = null;
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  /* addSize creates a size entry in the database
   * @requestBody: {"name": "test"}
   */
  function addSize() {
  	$request = \Slim\Slim::getInstance()->request();
    $size = json_decode($request->getBody());
    $sql = "INSERT INTO size (name) VALUES (:name)";
    try {
      $db = getConnection("alcapp");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("name", $size->name);
      $stmt->execute();
      $size->id = $db->lastInsertId();
      $db = null;
      echo json_encode($size);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  /* deleteSize deletes a size
   */
  function deleteSize($id) {
  	$sql = "DELETE FROM size WHERE id=:id";
    try {
      $db = getConnection("alcapp");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      $db = null;
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  /* addBrand creates a brand entry in the database
   * @requestBody: {"name": "test"}
   */
  function addBrand() {
  	$request = \Slim\Slim::getInstance()->request();
    $brand = json_decode($request->getBody());
    $sql = "INSERT INTO brand (name) VALUES (:name)";
    try {
      $db = getConnection("alcapp");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("name", $brand->name);
      $stmt->execute();
      $brand->id = $db->lastInsertId();
      $db = null;
      echo json_encode($brand);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  /* deleteBrand deletes a brand
   */
  function deleteBrand($id) {
  	$sql = "DELETE FROM brand WHERE id=:id";
    try {
      $db = getConnection("alcapp");
      $stmt = $db->prepare($sql);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      $db = null;
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }
	
	/* -- common functions ------------------------------------------------------------------- */
	
	function getTable($dbname, $table) {
		$sql = "SELECT * FROM ".$table;
		try {
      $db = getConnection($dbname);
      $stmt = $db->query($sql);
      $results = $stmt->fetchAll(PDO::FETCH_OBJ);
      $db = null;
      echo json_encode($results);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	}
	
	function getRowByID($dbname, $table, $id) {
		$sql = "SELECT * FROM ".$table." WHERE id=:id";
  	try {
      $db = getConnection($dbname);
      $stmt = $db->prepare($sql);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      $result = $stmt->fetchObject();
      $db = null;
      echo json_encode($result);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	}
  
  function deleteRowByID($dbname, $table, $id) {
    $sql = "DELETE FROM ".$table." WHERE id=:id";
    try {
      $db = getConnection($dbname);
      $stmt = $db->prepare($sql);
      $stmt->bindParam("id", $id);
      $stmt->execute();
      $db = null;
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }
	
	function getRowByOther($dbname, $table, $key, $value) {
		$sql = "SELECT * FROM ".$table." WHERE ".$key."=:value";
  	try {
      $db = getConnection($dbname);
      $stmt = $db->prepare($sql);
      $stmt->bindParam("value", $value);
      $stmt->execute();
      $result = $stmt->fetchObject();
      $db = null;
      echo json_encode($result);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
	}
  
  function getRowsByOther($dbname, $table, $key, $value) {
    $sql = "SELECT * FROM ".$table." WHERE ".$key."=:value";
    try {
      $db = getConnection($dbname);
      $stmt = $db->prepare($sql);
      $stmt->bindParam("value", $value);
      $stmt->execute();
      $result = $stmt->fetchAll(PDO::FETCH_OBJ);
      $db = null;
      echo json_encode($result);
    } catch(PDOException $e) {
      echo '{"error":{"text":'. $e->getMessage() .'}}';
    }
  }

  /* ----------------------------------database connections--------------------------------- */

  function getConnection($dbname) {
    $dbhost="localhost";
    $dbuser="root";
    $dbpass="root";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
  }
?>