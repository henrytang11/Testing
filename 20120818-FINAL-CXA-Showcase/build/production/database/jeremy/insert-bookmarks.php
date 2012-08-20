<?php
	
	// Step 1: Creating a Connection
	//$connect = mysql_connect('127.6.126.129:3306', 'admin', 'zDRStfnDAtfZ');
	$connect = mysql_connect('localhost', 'root', 'root');
	//$connect = mysql_connect('127.6.126.129', 'admin', 'zDRStfnDAtfZ');
					
	if(!$connect) {
		die('Could not connect');
	}
	
	// Step #2: Connecting to Database

	//if(!mysql_select_db('CodeXtreme')) {
	if(!mysql_select_db('dailymon_codextreme')) {
		die('The database does not exist');
	}

	insertBookmark();

	function insertBookmark(){
		$userName = $_POST['userName'];
		$taskId = $_POST['taskId'];
		$placeId = $_POST['placeId'];
		$timeId = $_POST['timeId'];

		//$userName = $_GET['userName'];
		//$taskId = $_GET['taskId'];
		//$placeId = $_GET['placeId'];
		//$timeId = $_GET['timeId'];

		$query = "SELECT id FROM USER WHERE userName = '" . $userName . "'";


		$result = mysql_query($query);
		while($row = mysql_fetch_row($result)) {
			$userID = $row[0];
		}



		//$query2 = "INSERT INTO BOOKMARK (userID, taskID, placeID, timeID) VALUES (".$userID.",".$taskId.",".$placeId.",".$timeId.")";
		$query2 = "INSERT INTO BOOKMARK (userID, taskID, placeID, timeID) VALUES ($userID, $taskId, $placeId, $timeId)";

		$result2 = mysql_query($query2);

		echo '1'; // success message
	}
?>