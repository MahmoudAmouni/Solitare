<?php


$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['userName'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: userName']);
    exit;
}

include ('connection.php');

try {
      $score = random_int(0, 9999); 
    $duration = random_int(480, 1800);
    $sql = $mysql->prepare("INSERT INTO scores (userName, score, duration) VALUES (?, ?, ?)");
    
    if (!$sql) {
        throw new Exception('Prepare failed: ' . $mysql->error);
    }

    $userName = $input['userName'];
    

    $sql->bind_param('sii', $userName, $score, $duration);

    if (!$sql->execute()) {
        throw new Exception('Execute failed: ' . $sql->error);
    }

    echo json_encode([
        'id' => $sql->insert_id,
        'userName' => $userName,
        'score' => $score,
        'duration' => $duration
    ]);

    $sql->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    $mysql->close();
}
?>