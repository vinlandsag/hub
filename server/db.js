const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

let db = {
  colleges: [],
  users: [],
  events: [],
  registrations: []
};

function save() {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

function load() {
  if (fs.existsSync(dbPath)) {
    try {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (err) {
      console.error('Failed to load database file:', err);
      process.exit(1);
    }
  }

  if (!Array.isArray(db.colleges)) db.colleges = [];
  if (!Array.isArray(db.users)) db.users = [];
  if (!Array.isArray(db.events)) db.events = [];
  if (!Array.isArray(db.registrations)) db.registrations = [];
}

function nextId(collection) {
  const items = db[collection];
  return items.length === 0 ? 1 : Math.max(...items.map(item => item.id)) + 1;
}

function findOrCreateCollege(name) {
  let college = db.colleges.find(c => c.name === name);
  if (!college) {
    college = {
      id: nextId('colleges'),
      name,
      district: null,
      latitude: null,
      longitude: null
    };
    db.colleges.push(college);
    save();
  }
  return college;
}

function getCollegeById(id) {
  return db.colleges.find(c => c.id === id) || null;
}

function createUser({ name, email, phone, college }) {
  const user = {
    id: nextId('users'),
    name,
    email,
    phone,
    college,
    created_at: new Date().toISOString()
  };
  db.users.push(user);
  save();
  return user;
}

function updateUserById(id, updates) {
  const user = db.users.find(u => u.id === id);
  if (!user) return null;
  Object.assign(user, updates);
  save();
  return user;
}

function getUserByEmail(email) {
  return db.users.find(u => u.email === email) || null;
}

function getUserById(id) {
  return db.users.find(u => u.id === id) || null;
}

function createEvent({ title, type, description, date, host_college_id, registration_link }) {
  const event = {
    id: nextId('events'),
    title,
    type,
    description,
    date,
    host_college_id,
    registration_link,
    created_at: new Date().toISOString()
  };
  db.events.push(event);
  save();
  return getEventById(event.id);
}

function getEventById(id) {
  const event = db.events.find(e => e.id === id);
  if (!event) return null;
  const college = getCollegeById(event.host_college_id);
  return {
    ...event,
    college_name: college?.name || null,
    district: college?.district || null
  };
}

function getEvents(type) {
  const events = type ? db.events.filter(e => e.type === type) : db.events.slice();
  return events.map(event => {
    const college = getCollegeById(event.host_college_id);
    return {
      ...event,
      college_name: college?.name || null,
      district: college?.district || null
    };
  });
}

function createRegistration(userId, eventId) {
  const registration = {
    id: nextId('registrations'),
    user_id: userId,
    event_id: eventId,
    registered_at: new Date().toISOString(),
    status: 'confirmed'
  };
  db.registrations.push(registration);
  save();
  return registration;
}

function getRegistrationByUserEvent(userId, eventId) {
  return db.registrations.find(r => r.user_id === userId && r.event_id === eventId) || null;
}

function getRegistrationById(id) {
  return db.registrations.find(r => r.id === id) || null;
}

function deleteRegistrationById(id) {
  const index = db.registrations.findIndex(r => r.id === id);
  if (index === -1) return false;
  db.registrations.splice(index, 1);
  save();
  return true;
}

function getMyEvents(userId) {
  return db.registrations
    .filter(r => r.user_id === userId)
    .map(r => {
      const event = getEventById(r.event_id);
      return {
        ...event,
        registration_id: r.id,
        user_id: r.user_id,
        status: r.status,
        registered_at: r.registered_at
      };
    });
}

function init() {
  load();
  if (db.colleges.length === 0) {
    db.colleges.push(
      { id: 1, name: 'College of Engineering Trivandrum', district: 'Thiruvananthapuram', latitude: 8.5276, longitude: 76.9366 },
      { id: 2, name: 'Government Engineering College Thrissur', district: 'Thrissur', latitude: 10.5211, longitude: 76.2239 },
      { id: 3, name: 'Rajagiri School of Engineering & Technology', district: 'Ernakulam', latitude: 10.0043, longitude: 76.3165 }
    );
  }
  if (db.events.length === 0) {
    db.events.push(
      { id: 1, title: 'Code Wars 2.0', type: 'hackathon', description: 'A 24-hour coding event.', date: '2024-08-25', host_college_id: 1, registration_link: 'https://example.com/register-codewars', created_at: new Date().toISOString() },
      { id: 2, title: 'AI/ML Bootcamp', type: 'workshop', description: 'A beginner-friendly ML workshop.', date: '2024-09-02', host_college_id: 3, registration_link: 'https://example.com/register-aiml', created_at: new Date().toISOString() },
      { id: 3, title: 'Flutter Fest', type: 'workshop', description: 'Build cross-platform apps with Flutter.', date: '2024-08-30', host_college_id: 1, registration_link: 'https://example.com/register-flutter', created_at: new Date().toISOString() },
      { id: 4, title: 'Future of Web Development', type: 'talk', description: 'Explore emerging trends in web development including Web3, PWAs, and modern frameworks.', date: '2024-09-05', host_college_id: 1, registration_link: 'https://example.com/register-webdev', created_at: new Date().toISOString() }
    );
  }
  save();
}

module.exports = {
  init,
  findOrCreateCollege,
  getCollegeById,
  getEventById,
  getEvents,
  getUserByEmail,
  getUserById,
  createUser,
  updateUserById,
  createEvent,
  createRegistration,
  getRegistrationByUserEvent,
  deleteRegistrationById,
  getMyEvents
};
