exports.protocol = process.env.protocol || "http";
exports.key_path = process.env.key_pass || 'key_path';
exports.cert_path = process.env.cert_path || 'cert_path';
exports.key_pass = process.env.key_pass || 'key_pass';

exports.game_addr = process.env.game_addr || "0.0.0.0";
exports.game_port = process.env.game_port || "8016";
exports.http_addr = process.env.http_addr || "127.0.0.1";
exports.http_port = process.env.http_port || "8018";
