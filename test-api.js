const fs = require('fs');
const db = JSON.parse(fs.readFileSync('./data/db.json', 'utf8'));

const sessionId = 'u2';
const employeeId = 'u4'; // Priya Sharma

const directReportIds = db.users.filter(u => u.managerId === sessionId).map(u => u.id);
console.log("Direct Reports:", directReportIds);

let goals = db.goals;
if (!directReportIds.includes(employeeId) && employeeId !== sessionId) {
  console.log('Unauthorized');
} else {
  goals = goals.filter(g => g.employeeId === employeeId);
  console.log("Goals returned by API:", goals.length);
  
  const submitted = goals.filter(g => g.status === 'SUBMITTED');
  console.log("Submitted Goals for Frontend:", submitted.length);
}
