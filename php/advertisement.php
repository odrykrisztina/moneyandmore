<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `advertisement`.`id`, 
                `advertisement`.`title`,
                GROUP_CONCAT(`advertisement_content`.`content` SEPARATOR ' ||| ') 
                AS `contents`
           FROM `advertisement`
      LEFT JOIN `advertisement_content`
             ON `advertisement`.`id` = `advertisement_content`.`ad_id` AND 
                `advertisement_content`.`valid` = 1
          WHERE `advertisement`.`valid` = 1 AND 
                `advertisement`.`type` = 'home'
       GROUP BY `advertisement`.`id`, `advertisement`.`title`;";

// Execute query
$result = $db->execute($query);

// Explode contents
foreach($result as $ind => $item) {
  $result[$ind]["contents"] = explode(' ||| ', $item["contents"]);
}

// Close connection
$db = null;

// Set response
Util::setResponse($result);