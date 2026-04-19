const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

db.init();

app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.get('/api/status', (req, res) => res.json({ status: 'ok', version: '0.1.0' }));

app.get('/api/events', (req, res) => {
  const filterType = req.query.type;
  res.json(db.getEvents(filterType));
});

app.post('/api/events', (req, res) => {
  const { title, type, description, date, college_name, registration_link } = req.body;
  if (!title || !type || !description || !date || !college_name) {
    return res.status(400).json({ message: 'Missing required fields: title, type, description, date, college_name' });
  }

  const collegeRow = db.findOrCreateCollege(college_name);
  const event = db.createEvent({ title, type, description, date, host_college_id: collegeRow.id, registration_link: registration_link || null });
  res.status(201).json({ event, message: 'Event published successfully' });
});

app.post('/api/college-login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  if (password !== 'college123') {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  let collegeName = email.includes('@') ? email.split('@')[0].replace(/[._]/g, ' ') : email;
  collegeName = collegeName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  res.json({ message: 'College login successful', college: { email, name: collegeName } });
});

app.get('/api/events/:id', (req, res) => {
  const event = db.getEventById(parseInt(req.params.id, 10));
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
});

app.post('/api/register', (req, res) => {
  const { name, email, phone, college } = req.body;
  if (!name || !email || !phone || !college) return res.status(400).json({ message: 'Missing fields' });

  db.findOrCreateCollege(college);
  const exists = db.getUserByEmail(email);
  if (exists) return res.status(409).json({ message: 'Already registered' });

  const user = db.createUser({ name, email, phone, college });
  res.json({ user, message: 'Registered successfully' });
});

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const user = db.getUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ user, message: 'Login successful' });
});

app.post('/api/event-registration', (req, res) => {
  const { userId, eventId } = req.body;
  if (!userId || !eventId) return res.status(400).json({ message: 'Missing fields' });

  const exists = db.getRegistrationByUserEvent(userId, eventId);
  if (exists) return res.status(409).json({ message: 'Already registered for this event' });

  const registration = db.createRegistration(userId, eventId);
  res.status(201).json(registration);
});

app.get('/api/my-events/:userId', (req, res) => {
  const events = db.getMyEvents(parseInt(req.params.userId, 10));
  res.json(events);
});

app.get('/api/users/:id', (req, res) => {
  const user = db.getUserById(parseInt(req.params.id, 10));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, phone, college } = req.body;
  const userId = parseInt(req.params.id, 10);

  if (!name || !email || !phone || !college) {
    return res.status(400).json({ message: 'Missing required fields: name, email, phone, college' });
  }

  const user = db.updateUserById(userId, { name, email, phone, college });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user, message: 'Profile updated successfully' });
});

app.delete('/api/registrations/:id', (req, res) => {
  const registrationId = parseInt(req.params.id, 10);
  const removed = db.deleteRegistrationById(registrationId);
  if (!removed) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  res.json({ message: 'Registration cancelled successfully' });
});

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

app.listen(PORT, () => console.log(`Backend API running on http://localhost:${PORT}`));
