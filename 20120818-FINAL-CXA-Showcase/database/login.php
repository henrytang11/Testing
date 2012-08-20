<?php
	//allow cross-origin resource sharing
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: x-requested-with");

	/** The name of the database for codeXtreme */
	//define('DB_NAME', $_ENV['OPENSHIFT_APP_NAME']);

	/** MySQL database username */
	//define('DB_USER', $_ENV['OPENSHIFT_DB_USERNAME']);

	/** MySQL database password */
	//define('DB_PASSWORD', $_ENV['OPENSHIFT_DB_PASSWORD']);

	/** MySQL hostname */
	//define('DB_HOST', $_ENV['OPENSHIFT_DB_HOST']);

	// Step 1: Creating a Connection	
	$connect = mysql_connect('127.6.126.129', 'admin', 'zDRStfnDAtfZ');
					
	if(!$connect) {
		die('Could not connect');
	}
	
	// Step #2: Connecting to Database
	if(!mysql_select_db('CodeXtreme')) {
		die('The database does not exist');
	}
	
	validate();
	
	function validate(){
		$userName = $_POST['userName'];
		$password = $_POST['password'];
		
		$userName = mysql_real_escape_string($userName);
		$password = mysql_real_escape_string($password);
		
		$query = "SELECT password FROM USER WHERE userName ='" . $userName ."'";
		$result = mysql_query($query);
		while($row = mysql_fetch_row($result)) {
			if($password == $row[0]) {
				echo '{success: true}';
			}
		}
	}
?>
