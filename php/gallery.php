<?php
declare(strict_types=1);

// Set environment
require_once('./environment.php');

// Set result
$result = array();

// Get gallery images
$result['gallery'] = glob("./media/image/gallery/*.{jpg,png,gif,tiff,webp}", 
													GLOB_BRACE);

// Check gallery images, when is not empty, then randomize
if (is_array($result['gallery']) && 
			!empty($result['gallery']))
		 shuffle($result['gallery']);


// Get carousel images
$result['carousel'] = glob("./media/image/carousel/*.{jpg,png,gif,tiff,webp}", 
													GLOB_BRACE);

// Check carousel images, when is not empty, then randomize
if (is_array($result['carousel']) && 
			!empty($result['carousel']))
		 shuffle($result['carousel']);


// Set response
Util::setResponse($result);