const crypto = require('crypto').webcrypto;

async function verifySessionSignature(sessionValue) {
  try {
    const secret = process.env.SESSION_SECRET || 'dev-secret-fixed-for-testing';

    const [payloadBase64, signature] = sessionValue.split('.');
    if (!payloadBase64 || !signature) return null;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw', keyData, { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify']
    );

    const sigBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
    const dataBuffer = encoder.encode(payloadBase64);

    const valid = await crypto.subtle.verify('HMAC', key, sigBuffer, dataBuffer);
    if (!valid) return null;

    return JSON.parse(atob(payloadBase64));
  } catch (e) {
    console.error(e);
    return null;
  }
}

// from test-session.js output
const sessionValue = 'eyJpZCI6InUyIiwibmFtZSI6IkRlbW8gTWFuYWdlciIsImVtYWlsIjoibWdyQGRlbW8uY29tIiwicm9sZSI6Ik1BTkFHRVIifQ==.AZO9FVP36qHXroh0keVkM6e0WaEpM5pGKSxOvJRhG4I=';
verifySessionSignature(sessionValue).then(console.log);
