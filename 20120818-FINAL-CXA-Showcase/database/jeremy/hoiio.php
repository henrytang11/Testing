<html>
	<head>
		<title>Hoiio</title>
	</head>
	<body>
	<?php
		//Retrieve variables
	
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
		
		$taskId = $_POST['taskId'];
		$timeId = $_POST['timeId'];
		
		$task = "";
		$time = "";
		
		//echo $taskId . $placeId . $timeId;
		
		$query = "SELECT taskSmsMsg FROM TASK WHERE taskID = '" . $taskId . "'";
		$result = mysql_query($query);
		while($row = mysql_fetch_row($result)) {
			$task = $row[0];
		}

		$query = "SELECT timeSmsMsg FROM TIME WHERE timeID = '" . $timeId . "'";
		$result = mysql_query($query);
		while($row = mysql_fetch_row($result)) {
			$time = $row[0];
		}
	
		$message = $task . " " . $time;
		
		hoiiofied($message);
		
		function hoiiofied($message) {
			
			/* Hoiio developer credentials */
			$hoiioAppId = "6wt10XPZkPNIisf2";
			$hoiioAccessToken = "6FHhWAk8CHly8HE5";
			$sendSmsURL = "https://secure.hoiio.com/open/sms/send";
			/* Recipient of SMS */
			$destination = "+6591867179";
			
			/* prepare HTTP POST variables */
			$fields = array(
				'app_id' => urlencode($hoiioAppId),
				'access_token' => urlencode($hoiioAccessToken),
				'dest' => urlencode($destination), // send SMS to this phone
				'msg' => urlencode($message) // message content in SMS
			);
			// form up variables in the correct format for HTTP POST
			$fields_string = "";
			foreach($fields as $key => $value)
				$fields_string .= $key . '=' . $value . '&';
			$fields_string = rtrim($fields_string,'&');
			/* initialize cURL */
			$ch = curl_init();
			/* set options for cURL */
			curl_setopt($ch, CURLOPT_URL, $sendSmsURL);
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
			/* execute HTTP POST request */
			$result = curl_exec($ch);

			if ( $error = curl_error($ch) ) {
				echo 'ERROR: ',$error;
			}
			//print($result);
			
			/* close connection */
			curl_close($ch);			
			
		}
	?>

	</body>
</html>