<?php

require_once '../vendor/autoload.php';

$uploader = new \Bazalt\Uploader\Base(['jpg', 'png', 'jpeg', 'bmp', 'gif'], 1000000);
$result = $uploader->handleUpload(__DIR__ . DIRECTORY_SEPARATOR . 'uploads');

echo json_encode($result);