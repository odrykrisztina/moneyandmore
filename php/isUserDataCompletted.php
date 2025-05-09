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
                `user`.`address`
           FROM `user`
          WHERE `user`.`id` = :id AND
                `user`.`valid` = 1
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

// Check has empty values
$result = !in_array(null, $result, true) && 
          !in_array('', $result, true);

// Set response
Util::setResponse($result);