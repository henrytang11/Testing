<?php
	//allow cross-origin resource sharing
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: x-requested-with");
	
	// Step 1: Creating a Connection
	$connect = mysql_connect('127.6.126.129', 'admin', 'zDRStfnDAtfZ');
					
	if(!$connect) {
		die('Could not connect');
	}
	
	// Step #2: Connecting to Database

	if(!mysql_select_db('CodeXtreme')) {
		die('The database does not exist');
	}

	getBookmarks();
	

	function getBookmarks() {
		$userName = $_POST['userName'];
		$query = "SELECT id FROM USER WHERE userName = '" . $userName . "'";
		
		
		$result = mysql_query($query);
		while($row = mysql_fetch_row($result)) {
			$userID = $row[0];
		}
		
		$query = "SELECT 
			task.taskID, task.taskImgPath, task.taskAudioPath, 
			place.placeID, place.placeImgPath, place.placeAudioPath, 
			time.timeID, time.timeImgPath, time.timeAudioPath

			FROM BOOKMARK bookmark 

			INNER JOIN TIME time ON bookmark.timeID = time.timeID 
			INNER JOIN TASK task ON task.taskID = bookmark.taskID
			INNER JOIN PLACE place ON place.placeID = bookmark.placeID
			
			WHERE userID = '" . $userID . "'";
			
		$result = mysql_query($query);
		$nbrows = mysql_num_rows($result);

		while($rec = mysql_fetch_array($result)) {
			$arr[] = $rec;
		}

		$jsonresult = JEncode($arr);

		echo '{"total":"'.$nbrows.'","results":'.$jsonresult.'}';
	}

	function JEncode($arr) {
		$data = json_encode($arr);
		
		return $data;
	}
?>