<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

// Set query
$query  = $db->preparateUpdate('user', $args, "id");
$query .= " WHERE `id` = :id;";

// Execute query
$result = $db->execute($query, $args);

// Close connection
$db = null;

// Check result
if (!$result["affectedRows"])
  Util::setError('Az adatainak módosítása nem sikerült!');

// Set response
Util::setResponse('Az adatai módosítva lettek!');