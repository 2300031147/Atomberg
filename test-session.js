const crypto = require('crypto');
function getSessionSecret() { return 'dev-secret-fixed-for-testing'; }
function sign(payload) {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64');
}
const user = { id: 'u2', name: 'Demo Manager', email: 'mgr@demo.com', role: 'MANAGER' };
const payload = JSON.stringify(user);
const payloadBase64 = Buffer.from(payload).toString('base64');
const signature = sign(payloadBase64);
console.log(`${payloadBase64}.${signature}`);
