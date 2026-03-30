<?php
header('Content-Type: application/json; charset=utf-8');

function respond(int $statusCode, bool $success, string $message): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ]);
    exit;
}

function sanitizeHeaderValue(string $value): string
{
    return str_replace(["\r", "\n"], '', trim($value));
}

function stringLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    return strlen($value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Ungueltige Anfrage-Methode.');
}

$name = trim((string)($_POST['name'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$honeypot = trim((string)($_POST['website'] ?? ''));
$formStartedAt = (int)($_POST['form_started_at'] ?? 0);

$clientIp = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$clientIpSafe = preg_replace('/[^a-f0-9:.]/i', '', $clientIp) ?: 'unknown';
$now = time();

if ($honeypot !== '') {
    respond(422, false, 'Anfrage konnte nicht verarbeitet werden.');
}

if ($formStartedAt <= 0 || ($now - $formStartedAt) < 3 || ($now - $formStartedAt) > 7200) {
    respond(422, false, 'Bitte Formular erneut ausfuellen und absenden.');
}

$rateLimitWindowSeconds = 900;
$rateLimitMaxRequests = 5;
$rateLimitFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'aa_contact_rate_' . md5($clientIpSafe) . '.json';

$requestTimestamps = [];
if (is_file($rateLimitFile)) {
    $storedData = json_decode((string)file_get_contents($rateLimitFile), true);
    if (is_array($storedData)) {
        $requestTimestamps = array_values(array_filter($storedData, static function ($value): bool {
            return is_int($value) || ctype_digit((string)$value);
        }));
    }
}

$requestTimestamps = array_values(array_filter($requestTimestamps, static function ($ts) use ($now, $rateLimitWindowSeconds): bool {
    return ((int)$ts) > ($now - $rateLimitWindowSeconds);
}));

if (count($requestTimestamps) >= $rateLimitMaxRequests) {
    respond(429, false, 'Zu viele Anfragen in kurzer Zeit. Bitte spaeter erneut versuchen.');
}

$requestTimestamps[] = $now;
@file_put_contents($rateLimitFile, json_encode($requestTimestamps), LOCK_EX);

if ($name === '' || $email === '' || $message === '') {
    respond(422, false, 'Bitte fuellen Sie alle Pflichtfelder aus (Name, E-Mail, Nachricht).');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Bitte geben Sie eine gueltige E-Mail-Adresse ein.');
}

if (stringLength($name) > 120 || stringLength($subject) > 180 || stringLength($email) > 180 || stringLength($phone) > 60) {
    respond(422, false, 'Ein oder mehrere Eingabefelder sind zu lang.');
}

if (stringLength($message) < 8 || stringLength($message) > 5000) {
    respond(422, false, 'Nachricht muss zwischen 8 und 5000 Zeichen lang sein.');
}

$urlCount = preg_match_all('/https?:\/\//i', $message);
if ($urlCount !== false && $urlCount > 2) {
    respond(422, false, 'Bitte reduzieren Sie die Anzahl von Links in der Nachricht.');
}

$to = 'info-automobile@web.de';
$cleanSubject = $subject !== '' ? $subject : 'Neue Kontaktanfrage';
$mailSubject = 'Kontaktformular: ' . sanitizeHeaderValue($cleanSubject);

$safeName = sanitizeHeaderValue($name);
$safeEmail = sanitizeHeaderValue($email);
$safePhone = preg_replace('/[^0-9+()\-\s]/', '', $phone) ?? '';

$mailBodyLines = [
    'Neue Anfrage ueber das Kontaktformular:',
    '',
    'Name: ' . $safeName,
    'Telefon: ' . ($safePhone !== '' ? $safePhone : '-'),
    'E-Mail: ' . $safeEmail,
    'Betreff: ' . sanitizeHeaderValue($cleanSubject),
    'IP: ' . $clientIpSafe,
    '',
    'Nachricht:',
    $message,
];

$mailBody = implode("\r\n", $mailBodyLines);

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: AUTOMOBILE A & A <info-automobile@web.de>';
$headers[] = 'Reply-To: ' . $safeEmail;
$headers[] = 'X-Mailer: PHP/' . PHP_VERSION;

$sentToDealer = @mail($to, $mailSubject, $mailBody, implode("\r\n", $headers));

if (!$sentToDealer) {
    respond(500, false, 'Die Nachricht konnte nicht gesendet werden. Bitte spaeter erneut versuchen.');
}

$customerSubject = 'Wir haben Ihre Anfrage erhalten - AUTOMOBILE A & A';
$customerBody = implode("\r\n", [
    'Guten Tag ' . $safeName . ',',
    '',
    'vielen Dank fuer Ihre Anfrage. Wir haben Ihre Nachricht erhalten und melden uns zeitnah bei Ihnen.',
    '',
    'Ihr Team von AUTOMOBILE A & A',
    'Telefon: +49 176 6154 6663',
    'E-Mail: info-automobile@web.de',
]);

$customerHeaders = [];
$customerHeaders[] = 'MIME-Version: 1.0';
$customerHeaders[] = 'Content-Type: text/plain; charset=UTF-8';
$customerHeaders[] = 'From: AUTOMOBILE A & A <info-automobile@web.de>';
$customerHeaders[] = 'Reply-To: info-automobile@web.de';

@mail($safeEmail, $customerSubject, $customerBody, implode("\r\n", $customerHeaders));

respond(200, true, 'Ihre Anfrage wurde erfolgreich gesendet. Vielen Dank!');
