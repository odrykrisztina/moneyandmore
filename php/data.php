<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `id`, 
								`name` 
					 FROM `type` 
					WHERE `type` = 'SOLUTION'
			 ORDER BY `name`";

// Execute query
$result['solutions'] = $db->execute($query);

// Set query
$query ="SELECT `city`,
								`postcode`,
								`address`
					FROM 	`office`
					WHERE `valid` = 1;";

// Execute query
$result['offices'] = $db->execute($query);

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
                `advertisement`.`type` = 'about_us'
       GROUP BY `advertisement`.`id`, `advertisement`.`title`;";

// Execute query
$result['advertisement'] = $db->execute($query);

// Explode contents
foreach($result['advertisement'] as $ind => $item) {
  $result['advertisement'][$ind]["contents"] = explode(' ||| ', $item["contents"]);
}

// Close connection
$db = null;

// Set response
Util::setResponse($result);