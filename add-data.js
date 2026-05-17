const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'db.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Add some new users
const newUsers = [
  { id: "u6", name: "Anjali Desai", email: "anjali@demo.com", password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", role: "EMPLOYEE", managerId: "u2" },
  { id: "u7", name: "Karan Singh", email: "karan@demo.com", password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", role: "EMPLOYEE", managerId: "u2" }
];
data.users.push(...newUsers);

// Add more goals
const newGoals = [
  // For Priya (u4)
  { id: "g7", employeeId: "u4", cycleId: "c1", thrustArea: "Customer Success", title: "Customer Retention", description: "Maintain 95% retention rate for Q1", uomType: "NUMERIC_MIN", target: "95", weightage: 30, status: "DRAFT", isLocked: false, isShared: false, createdAt: new Date().toISOString() },
  // For Anjali (u6)
  { id: "g8", employeeId: "u6", cycleId: "c1", thrustArea: "Innovation", title: "Process Automation", description: "Automate 3 manual marketing processes", uomType: "NUMERIC_MIN", target: "3", weightage: 60, status: "SUBMITTED", isLocked: false, isShared: false, createdAt: new Date().toISOString() },
  { id: "g9", employeeId: "u6", cycleId: "c1", thrustArea: "Revenue", title: "Marketing Leads", description: "Generate 500 qualified leads", uomType: "NUMERIC_MIN", target: "500", weightage: 40, status: "SUBMITTED", isLocked: false, isShared: false, createdAt: new Date().toISOString() },
  // For Karan (u7)
  { id: "g10", employeeId: "u7", cycleId: "c1", thrustArea: "Operational Excellence", title: "Cloud Cost Optimization", description: "Reduce AWS bill by 15%", uomType: "NUMERIC_MIN", target: "15", weightage: 100, status: "APPROVED", isLocked: true, isShared: false, createdAt: new Date().toISOString() },
  // For Demo Employee (u1)
  { id: "g11", employeeId: "u1", cycleId: "c1", thrustArea: "Team Dev", title: "Mentorship", description: "Mentor 2 junior developers", uomType: "NUMERIC_MIN", target: "2", weightage: 10, status: "APPROVED", isLocked: true, isShared: false, createdAt: new Date().toISOString() }
];

// Rebalance u1's goals so they add up to 100 (u1 had 40, 30, 30 -> let's make it 40, 25, 25, 10)
const g2 = data.goals.find(g => g.id === "g2");
if (g2) g2.weightage = 25;
const g3 = data.goals.find(g => g.id === "g3");
if (g3) g3.weightage = 25;

data.goals.push(...newGoals);

// Add some check-ins
const newCheckins = [
  { id: "ci3", goalId: "g10", employeeId: "u7", quarter: "Q1", actualAchievement: "10", progressStatus: "ON_TRACK", computedScore: 0.66, managerComment: "Good progress so far.", createdAt: new Date().toISOString() },
  { id: "ci4", goalId: "g11", employeeId: "u1", quarter: "Q1", actualAchievement: "1", progressStatus: "ON_TRACK", computedScore: 0.5, createdAt: new Date().toISOString() }
];
data.checkIns.push(...newCheckins);

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
console.log("Mock data added successfully.");
