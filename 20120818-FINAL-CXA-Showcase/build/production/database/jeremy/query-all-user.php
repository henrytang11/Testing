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

	getList();
	
	function getList() {
		$query = "SELECT * FROM USER";
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