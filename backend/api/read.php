<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include ('connection.php');

try {
    $sql = "SELECT id, userName, score, duration FROM scores ORDER BY id DESC";
    $res = $mysql->query($sql);

    if ($res === false) {
        throw new Exception('Query failed: ' . $mysql->error);
    }

    $scores = [];
    while ($row = $res->fetch_assoc()) {
        $scores[] = $row;
    }

    echo json_encode($scores);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $mysql->close();
}
?>