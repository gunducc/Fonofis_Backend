const config = require('../config/config');
const { createCipheriv, createDecipheriv, scryptSync } = require('crypto');
const secret = config.get('authentication.token.secret');
const algorithm = 'aes-192-cbc';

const key = scryptSync(secret, 'salt', 24);
const iv = Buffer.alloc(16, 0); // Initialization crypto vector

function encrypt(text) {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
