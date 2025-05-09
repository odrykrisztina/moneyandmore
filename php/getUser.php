<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `email`, 
                `phone`
           FROM `user`
          WHERE `id` = :id
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