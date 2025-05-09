<?php
declare(strict_types=1);

// Set arguments
$_POST['data'] = '{
    "id": 24,
    "type": "A",
    "rank": "FA",
    "superior": 2
}';

// Call php file to debug
require_once('./tasks.php');

/*

UPDATE `contract_attachment`
INNER JOIN `contract`
ON `contract`.`id` = `contract_attachment`.`contract_id`
SET `contract_attachment`.`worker_id`= `contract`.`worker_id`

*/