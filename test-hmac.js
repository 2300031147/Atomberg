const crypto = require('crypto');

const secret = 'dev-secret-fixed-for-testing';
const payload = "hello";

const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64');
console.log("Node HMAC Base64:", signature);

async function testSubtle() {
  const encoder = new TextEncoder();
  const key = await crypto.webcrypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify', 'sign']
  );
  
  // What does verify do?
  const sigBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  const dataBuffer = encoder.encode(payload);
  const valid = await crypto.webcrypto.subtle.verify('HMAC', key, sigBuffer, dataBuffer);
  console.log("Subtle Verify valid?", valid);
}
testSubtle();
