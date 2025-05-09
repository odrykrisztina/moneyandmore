<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `id`, 
								`name` 
					 FROM `type` 
					WHERE `type` = :type
			 ORDER BY `name`";

// Execute query
$result = $db->execute($query, $args);

// Close connection
$db = null;

// Set response
Util::setResponse($result);