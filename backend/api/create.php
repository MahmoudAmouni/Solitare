<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['userName']) || !isset($input['score']) || !isset($input['duration'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: userName, score, duration']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=Solitare_db", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("INSERT INTO scores (userName, score, duration) VALUES (?, ?, ?)");
    $stmt->execute([$input['userName'], (int)$input['score'], (int)$input['duration']]);

    echo json_encode([
        'id' => $pdo->lastInsertId(),
        'userName' => $input['userName'],
        'score' => (int)$input['score'],
        'duration' => (int)$input['duration']
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>