<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `id`
           FROM `user` 
          WHERE `email` = ?
          LIMIT 1";

// Execute query
$result = $db->execute($query, [$args['email']]);

// Check result
if (!is_null($result)) {

  // Close connection
  $db = null;

  // Set error
  Util::setError('A felhasználó ezzel az e-mail címmel már létezik!');
}

// Set query
$query = $db->preparateInsert('user', $args);

// Execute query
$result = $db->execute($query, array_values($args));

// Close connection
$db = null;

// Check result
if (!$result["affectedRows"])
  Util::setError('A regisztráció nem sikerült!');

// Set response
Util::setResponse($result["lastInsertId" ]);