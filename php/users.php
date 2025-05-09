<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `user`.`id`,
                `user`.`type`,
                `typeUser`.`name` AS `typeName`,
                `user`.`name`, 
                `user`.`born`,
                `user`.`gender`, 
                `typeGender`.`name` AS `genderName`,
                `user`.`phone`, 
                `user`.`address`,
                `user`.`email`,
                `user`.`password`,
                `user`.`created`,
                `user`.`valid`,
                IF(`user`.`valid` = 1, 'Igen', 'Nem') AS `validName`
           FROM `user`
     INNER JOIN `type` `typeUser`
			 			 ON `typeUser`.`id` = `user`.`type` AND
							 	`typeUser`.`type` = 'USER'
     INNER JOIN `type` `typeGender`
			 			 ON `typeGender`.`id` = `user`.`gender` AND
							 	`typeGender`.`type` = 'GENDER'
          WHERE `user`.`type` != 'A' AND
                `user`.`type` != 'W'
       ORDER BY `id`;";

// Execute query
$result[] = $db->execute($query);

// Close connection
$db = null;

// Set response
Util::setResponse($result);