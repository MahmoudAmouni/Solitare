<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=Solitare_db", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT id, userName, score, duration FROM scores ORDER BY id DESC");
    $scores = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($scores);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>