const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const data = fs.readFileSync(DB_PATH, 'utf8');
const db = JSON.parse(data);

const email = "mgr@demo.com";
const password = "password123";
const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

const user = db.users.find(u => u.email === email && u.password === hashedPassword);
console.log("User found:", !!user);
