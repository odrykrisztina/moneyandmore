<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Get arguments
$args = Util::getArgs();

// Set query
$query ="SELECT `contract`.`id`,
                `contract`.`unique_id`,
                `contract`.`type`,
                `type`.`name` AS `typeName`,
                `contract`.`user_id`,
                `user`.`name` AS `userName`,
                `contract`.`worker_id`,
                `userWorker`.`name` AS `workerName`, 
                LEFT(`contract`.`created`, 16) AS `created`,
                `contract`.`valid` 
           FROM `contract`
      LEFT JOIN `user`
			 			 ON `user`.`id` = `contract`.`user_id`
      LEFT JOIN `user` `userWorker`
			 			 ON `userWorker`.`id` = `contract`.`worker_id`
      LEFT JOIN `type`
			 			 ON `type`.`id` = `contract`.`type` AND
							 	`type`.`type` = 'CONTRACT'";
if (isset($args["id"]) && isset($args["type"])) {
  $key    = $args["type"] === "W" ? "worker_id" : "user_id";
  $query .= " WHERE `contract`.`{$key}` = {$args["id"]}";
}
$query .= " ORDER BY `contract`.`id`;";

// Execute query
$result = $db->execute($query);

// Check result exist
if (!is_null($result)) {

  // Setr result
  $result = [$result];

  // Set query
  $query ="SELECT `contract_attachment`.`id`, 
                  `contract_attachment`.`contract_id`,
                  `contract_attachment`.`type`,
                  `type`.`name` AS `typeName`,
                  `contract_attachment`.`comment`,
                  CONCAT(`contract_attachment`.`file_name`, '.', 
                          `contract_attachment`.`file_ext`) AS `file`,
                  LEFT(`contract_attachment`.`created`, 16) AS `created`,
                  `contract_attachment`.`valid` 
             FROM `contract_attachment`
        LEFT JOIN `type`
			 			   ON `type`.`id` = `contract_attachment`.`type` AND
							 	  `type`.`type` = 'ATTACHMENT'";
  if (isset($args["id"]) && isset($args["type"])) {
    $key    = $args["type"] === "W" ? "worker_id" : "user_id";
    $query .= " INNER JOIN `contract` ON 
                `contract`.`id` = `contract_attachment`.`contract_id` AND 
                `contract`.`{$key}` = {$args["id"]}";
  }
  $query .= " ORDER BY `contract_attachment`.`contract_id`, 
                       `contract_attachment`.`id`;";

  // Execute query
  $result[] = $db->execute($query);
}

// Close connection
$db = null;

// Set response
Util::setResponse($result);