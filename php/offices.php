<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `id`, 
                `country`, 
                `country_code`, 
                `phone`, 
                `city`, 
                `postcode`, 
                `address`, 
                `email` 
           FROM `office`
          WHERE `valid` = 1
       ORDER BY `id`;";

// Execute query
$result[] = $db->execute($query);

// Close connection
$db = null;

// Set response
Util::setResponse($result);