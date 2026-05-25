<?php
/**
 * DATCLOUD API CORE 2.0 - Secure Production Version
 */

// --- CONFIGURATION ---
ini_set('upload_max_filesize', '50M');
ini_set('post_max_size', '55M');
ini_set('memory_limit', '128M');

// --- HEADERS ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// Silence warnings and buffer output to ensure clean JSON
ob_start();
error_reporting(0); 

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents("php://input"), true);

// --- DATABASE CONNECTION ---
$db_host = 'localhost';
$db_name = 'datcloud_admin';     
$db_user = 'datcloud_admin1';    
$db_pass = 'Password@12345@+';   

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Helper to map category names to tables
    function getTargetTable($category) {
        $map = [
            'Video Editing' => 'video_editing',
            'Thumbnail Design' => 'thumbnail_design',
            'Web Development' => 'web_development',
            'Merchandise Design' => 'merchandise_design',
            'Poster Design' => 'poster_design'
        ];
        return $map[$category] ?? 'video_editing';
    }

    switch ($action) {
        case 'register':
            $username = $input['username'] ?? '';
            $email = $input['email'] ?? '';
            $pass = password_hash($input['password'] ?? '', PASSWORD_DEFAULT);
            $role = ($email === 'datcloud20@gmail.com') ? 'admin' : 'user';

            $stmt = $pdo->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
            try {
                $stmt->execute([$username, $email, $pass, $role]);
                ob_clean();
                echo json_encode(["success" => true]);
            } catch (Exception $e) {
                ob_clean();
                echo json_encode(["success" => false, "error" => "Account already exists or DB error."]);
            }
            break;

        case 'login':
            $email = $input['email'] ?? '';
            $pass = $input['password'] ?? '';

            // 1. Check Hardcoded Super Admin Override
            if ($email === 'datcloud20@gmail.com' && $pass === 'Password@12345@+') {
                ob_clean();
                echo json_encode([
                    "success" => true,
                    "role" => 'admin',
                    "username" => 'SuperAdmin',
                    "email" => $email
                ]);
                break;
            }

            // 2. Check Database
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($pass, $user['password'])) {
                ob_clean();
                echo json_encode([
                    "success" => true,
                    "role" => $user['role'],
                    "username" => $user['username'],
                    "email" => $user['email']
                ]);
            } else {
                ob_clean();
                echo json_encode(["success" => false, "error" => "Invalid credentials."]);
            }
            break;

        case 'get_projects':
            $sql = "
                SELECT *, 'Video Editing' as category FROM video_editing
                UNION ALL
                SELECT *, 'Thumbnail Design' as category FROM thumbnail_design
                UNION ALL
                SELECT *, 'Web Development' as category FROM web_development
                UNION ALL
                SELECT *, 'Merchandise Design' as category FROM merchandise_design
                UNION ALL
                SELECT *, 'Poster Design' as category FROM poster_design
                ORDER BY created_at DESC
            ";
            $stmt = $pdo->query($sql);
            $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($projects as &$p) { 
                $p['tags'] = !empty($p['tags']) ? explode(',', $p['tags']) : []; 
                $p['mainMediaUrl'] = $p['main_media_url'] ?? '';
                $p['imageUrl'] = $p['image_url'] ?? '';
                $p['websiteLink'] = $p['website_link'] ?? '';
                $p['driveLink'] = $p['drive_link'] ?? '';
            }
            ob_clean();
            echo json_encode($projects);
            break;

        case 'save_project':
            $table = getTargetTable($input['category']);
            $tags = is_array($input['tags']) ? implode(',', $input['tags']) : ($input['tags'] ?? '');
            
            $stmt = $pdo->prepare("INSERT INTO $table (id, title, status, tags, image_url, main_media_url, description, website_link, drive_link, client, year) 
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                                   ON DUPLICATE KEY UPDATE title=?, status=?, tags=?, image_url=?, main_media_url=?, description=?, website_link=?, drive_link=?, client=?, year=?");
            
            $params = [
                $input['id'], $input['title'], $input['status'], $tags, $input['imageUrl'], $input['mainMediaUrl'] ?? '', 
                $input['description'], $input['websiteLink'], $input['driveLink'], $input['client'], $input['year']
            ];
            $all_params = array_merge($params, array_slice($params, 1));
            $success = $stmt->execute($all_params);
            ob_clean();
            echo json_encode(["success" => $success]);
            break;

        case 'delete_project':
            $id = $_GET['id'] ?? '';
            foreach (['video_editing', 'thumbnail_design', 'web_development', 'merchandise_design', 'poster_design'] as $t) {
                $pdo->prepare("DELETE FROM $t WHERE id = ?")->execute([$id]);
            }
            ob_clean();
            echo json_encode(["success" => true]);
            break;

        case 'get_settings':
            $stmt = $pdo->query("SELECT setting_value FROM site_settings WHERE setting_key = 'main_config'");
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            ob_clean();
            if ($row && !empty($row['setting_value'])) {
                echo $row['setting_value'];
            } else {
                echo json_encode((object)[]);
            }
            break;

        case 'save_settings':
            $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES ('main_config', ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $success = $stmt->execute([json_encode($input)]);
            ob_clean();
            echo json_encode(["success" => $success]);
            break;

        case 'save_message':
            $stmt = $pdo->prepare("INSERT INTO messages (id, name, email, service, brief, timestamp) VALUES (?, ?, ?, ?, ?, ?)");
            $success = $stmt->execute([$input['id'], $input['name'], $input['email'], $input['service'], $input['brief'], $input['timestamp']]);
            ob_clean();
            echo json_encode(["success" => $success]);
            break;

        case 'get_messages':
            $stmt = $pdo->query("SELECT * FROM messages ORDER BY timestamp DESC");
            $msgs = $stmt->fetchAll(PDO::FETCH_ASSOC);
            ob_clean();
            echo json_encode($msgs);
            break;

        case 'delete_message':
            $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
            $success = $stmt->execute([$_GET['id']]);
            ob_clean();
            echo json_encode(["success" => $success]);
            break;

        case 'upload':
            if (!isset($_FILES['file'])) { 
                ob_clean(); 
                die(json_encode(["success" => false, "error" => "No file received."])); 
            }
            if (!file_exists("uploads")) mkdir("uploads", 0755, true);
            $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
            $fileName = uniqid() . "." . $ext;
            $path = "uploads/" . $fileName;
            if (move_uploaded_file($_FILES['file']['tmp_name'], $path)) {
                $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
                $host = $_SERVER['HTTP_HOST'];
                $uri = $_SERVER['REQUEST_URI'];
                $dir = dirname($uri);
                $dir = rtrim($dir, '/\\');
                $url = $protocol . "://" . $host . $dir . "/" . $path;
                ob_clean(); 
                echo json_encode(["success" => true, "url" => $url]);
            } else { 
                ob_clean(); 
                echo json_encode(["success" => false, "error" => "Move failed."]); 
            }
            break;

        default:
            ob_clean();
            echo json_encode(["error" => "Unknown action: " . $action]);
    }
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
exit;
