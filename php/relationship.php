<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

if (!$args["user_id"]) {

	// Create query
	$query = "SELECT `id` FROM `user` WHERE `email` = ? LIMIT 1";

	// Execute query
	$result = $db->execute($query, [$args["email"]]);

	// When user found then set user id
	if (!is_null($result)) $args["user_id"] = $result[0]["id"];
}

// Create query
$query = $db->preparateInsert('task', $args);

// Execute query
$result = $db->execute($query, array_values($args));

if (!$result["affectedRows"]) {

	// Set error
	Util::setError('A jelentkezés sikertelen volt!');
}

// Save task identifier
$taskId = $result["lastInsertId"];

// Create query
$query = $db->preparateInsert('task_item', ["task_id", "type"]);

// Execute query
$result = $db->execute($query, [$taskId, "ARI"]);

// Check not success
if (!$result['affectedRows']) {

	// Create query
	$query = "DELETE FROM `task` WHERE `id` = ?;";

	// Execute query
	$result = $db->execute($query, [$taskId]);

	// Close connection
	$db = null;

	// Set error
	Util::setError('A jelentkezés sikertelen volt!');
}

// Close connection
$db = null;

// Set response
Util::setResponse('A jelentkezés sikeres volt!');