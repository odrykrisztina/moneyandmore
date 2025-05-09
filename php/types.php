<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `type_group`.`id`,
                `type_group`.`name`
           FROM `type_group`
       ORDER BY `type_group`.`id`;";

// Execute query
$result = $db->execute($query);

if (!is_null($result)) {

  // Setr result
  $result = [$result];

  // Set query
  $query ="SELECT `type`.`id`,
                  `type`.`type`,  
                  `type`.`name` 
             FROM `type`
         ORDER BY `type`.`id`;";

  // Execute query
  $result[] = $db->execute($query);
}

// Close connection
$db = null;

// Set response
Util::setResponse($result);