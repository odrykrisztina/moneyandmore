<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Get arguments
$args = Util::getArgs();

// Connect to database
$db = new Database();

// Set query
$query ="SELECT `user`.`id`, 
                `user`.`type`, 
                `worker`.`rank`,
                `worker`.`ranking`,
                `worker`.`superior`,
                `user`.`name`, 
                `user`.`password`,
                `user`.`valid`
           FROM `user`
      LEFT JOIN `worker`
			 			 ON `worker`.`user_id` = `user`.`id` 
          WHERE `user`.`email` = ?
          LIMIT 1";

// Execute query
$result = $db->execute($query, [$args['email']]);

// Close connection
$db = null;

// Check result
if (is_null($result))
  Util::setError('A felhasználó ezzel az e-mail címmel nem létezik!');

// Simplify result
$result = $result[0];

// Check result
if (!$result['valid'])
  Util::setError('Ezzel az e-mail címmel rendelkező felhasználó le van tiltva!');

// Check password
if ($result['password'] !== $args['password'])
  Util::setError('A jelszó helytelen!');

// Unset not neccessary keys
unset($result['valid'], $result['password']);

// Set response
Util::setResponse($result);