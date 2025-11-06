<?php

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Valid numeric ID required']);
    exit;
}

include ('connection.php');

try {
    $sql = $mysql->prepare("DELETE FROM scores WHERE id = ?");
    if (!$sql) {
        throw new Exception('Prepare failed: ' . $mysql->error);
    }

    $idInt = (int)$id;
    $sql->bind_param('i', $idInt);

    if (!$sql->execute()) {
        throw new Exception('Execute failed: ' . $sql->error);
    }

    if ($sql->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Record deleted']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'No record found with that ID']);
    }

    $sql->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    $mysql->close();
}
?>