<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Get arguments
$args = Util::getArgs();

// Set query
$query ="SELECT `task`.`id`,
                `task`.`worker_id`,
                `user`.`name` AS `workerName`, 
                `task`.`user_id`, 
                `task`.`name`, 
                `task`.`email`, 
                `task`.`phone`, 
                `task`.`comment`, 
                `task`.`type`,
                `type`.`name` AS `typeName`,
                LEFT(`task`.`created`, 16) AS `created`
           FROM `task`
      LEFT JOIN `user`
			 			 ON `user`.`id` = `task`.`worker_id`
      LEFT JOIN `type`
			 			 ON `type`.`id` = `task`.`type` AND
							 	`type`.`type` = 'TASK'";
if (isset($args["id"]) && isset($args["type"])) {
  $query .= " WHERE ";
  if ($args["type"] === 'A')
        $query .= "`task`.`worker_id` IS NULL";
  else  $query .= "`task`.`worker_id` = {$args["id"]}";
}
$query .= " ORDER BY `task`.`id`;";

// Execute query
$result = $db->execute($query);

if (!is_null($result)) {

  // Setr result
  $result = [$result];

  // Set query
  $query ="SELECT `task_item`.`id`, 
                  `task_item`.`task_id`, 
                  `task_item`.`type`,
                  `type`.`name` AS `typeName`,
                  `task_item`.`comment`, 
                  `task_item`.`status`,
                  LEFT(`task_item`.`created`, 16) AS `created`,
                  LEFT(`task_item`.`completed`, 16) AS `completed`,
                  `task_item`.`valid` 
             FROM `task_item`
        LEFT JOIN `type`
			 			   ON `type`.`id` = `task_item`.`type` AND
							 	  `type`.`type` = 'PROCESS'";
  if (isset($args["id"]) && isset($args["type"])) {
    $query .= " INNER JOIN `task` ON 
                `task`.`id` = `task_item`.`task_id` AND ";
    if ($args["type"] === 'A')
          $query .= "`task`.`worker_id` IS NULL";
    else  $query .= "`task`.`worker_id` = {$args["id"]}";
  }
  $query .= " ORDER BY `task_item`.`task_id`, `task_item`.`id`;";

  // Execute query
  $result[] = $db->execute($query);
}

// Close connection
$db = null;

// Set response
Util::setResponse($result);