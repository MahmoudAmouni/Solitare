<?php


$host = 'localhost';
$dbname = 'Solitare_db';
$username = 'root';
$password = '';

$mysql = new mysqli($host, $username, $password, $dbname);

if ($mysql->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $mysql->connect_error]));
}


?>

