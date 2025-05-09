<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Set query
$query =  "SELECT `user`.`name`,
									`user`.`gender`, 
									`worker`.`identifier`,
									`type`.`name` AS `rank`,
									`worker`.`ranking`,
									`worker`.`id_card`
						 FROM `user`
			 INNER JOIN `worker`
			 				 ON `worker`.`user_id` = `user`.`id`
			 INNER JOIN `type`
			 				 ON `type`.`id` = `worker`.`rank` AND
							 		`type`.`type` = 'RANK'
						WHERE `user`.`valid` = 1 AND
									`worker`.`valid` = 1
				 ORDER BY `worker`.`ranking` DESC, 
				 					`user`.`name` ASC;";

// Execute query
$result = $db->execute($query);

// Check result
if (!is_null($result)) {
	
	// Each workers
	foreach($result as $i => $person) {

		// Set person image, serch and check exist
		$fileName 	= $person['identifier'] . '.jpg';
		$workerPath = 'media/image/worker/';
		$file 			= Env::searchForFile($fileName, ['subFolder'=>$workerPath]);

		if (is_null($file)) {

						// Set blank image, and serch
						$fileName	= ($person['gender'] === 'F' ? 'fe' : '') . 'male-blank.png';
						$file 		= './media/image/blank/' . $fileName;
		} else 	$file 		= './'. $workerPath . $fileName;

		// Set person image, and unset person identifier
		$result[$i]['img'] = $file;
		unset($result[$i]['identifier']);
	}
}

// Close connection
$db = null;

// Set response
Util::setResponse($result);