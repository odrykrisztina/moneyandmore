<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `user`.`id`, 
                `user`.`type`, 
                `worker`.`rank`,
                `worker`.`ranking`,
                `worker`.`superior`,
                `user`.`name`
           FROM `user`
      LEFT JOIN `worker`
			 			 ON `worker`.`user_id` = `user`.`id` 
          WHERE `user`.`id` = :id AND
                `user`.`valid` = 1
          LIMIT 1";

// Execute query
$result = $db->execute($query, $args);

// Close connection
$db = null;

// Check result
if (is_null($result))
  Util::setError('A felhasználó ezzel az e-mail címmel nem létezik!');

// Simplify result
$result = $result[0];

// Set response
Util::setResponse($result);