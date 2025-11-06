<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");


$host = 'localhost';
$dbname = 'Solitare_db';
$username = 'root';
$password = '';

$mysql = new mysqli($host, $username, $password, $dbname);

if ($mysql->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $mysql->connect_error]));
}


?>

