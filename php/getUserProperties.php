<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `user`.`born`, 
                `user`.`gender`, 
                `user`.`phone`, 
                `user`.`address`,
                `user`.`email`,
                `user`.`password`,
                `typeUser`.`name` AS `typeName`,
                `typeRank`.`name` AS `rankName`
           FROM `user`
     INNER JOIN `type` `typeUser`
			 			 ON `typeUser`.`id` = `user`.`type` AND
							 	`typeUser`.`type` = 'USER'
      LEFT JOIN `worker`
			 			 ON `worker`.`user_id` = `user`.`id`
      LEFT JOIN `type` `typeRank`
			 			 ON `typeRank`.`id` = `worker`.`rank` AND
							 	`typeRank`.`type` = 'RANK'
          WHERE `user`.`id` = :id
          LIMIT 1";

// Execute query
$result = $db->execute($query, $args);

// Close connection
$db = null;

// Check result
if (is_null($result))
  Util::setError('A felhasználó ezzel az azonosítóval nem létezik!');

// Simplify result
$result = $result[0];

// Set response
Util::setResponse($result);