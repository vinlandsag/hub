# Kerala Events Hub

A platform to help students in Kerala discover tech events, hackathons, and workshops at nearby colleges.

## Vision
To provide equal opportunities for all students across Kerala to participate in educational and career-building programs by making it easy to find events near their college.

## Features

### Core Functionality
- **User Registration**: Complete form with name, email, phone, college, and OTP verification
- **Location-Based Discovery**: Find events at nearby colleges
- **Event Filtering**: Filter by event type (Hackathons, Workshops, Tech Talks)
- **Event Details**: Comprehensive information about each event

### Technical Features
- Responsive design for mobile and desktop
- Real-time event filtering
- College database with Kerala institutions
- Distance-based event recommendations

## Project Structure

```
html/hub/
├── index.html              # Landing/Home page
├── login.html              # User registration
├── dashboard.html          # Events dashboard with filtering
├── event-registration.html # Individual event registration
├── my-events.html          # User's registered events
├── profile.html            # User profile management
├── styles.css              # Styling
├── script.js               # JavaScript functionality
└── server/                 # Backend API + DB prototype
    ├── index.js           # Express API server
    ├── db.js              # SQLite migration + seed
    ├── package.json       # dependencies and scripts
    ├── kerala-events.db   # generated DB file (runtime)
    └── README.md          # backend usage docs
```

## How to Run

1. **Home Page**: Open `index.html` to see the landing page with project overview
2. **User Registration**: Click "Login/Register" to access the complete registration form with name, email, phone, college, and OTP verification
3. **Authentication Required**: After successful registration, you'll be automatically logged in and redirected to the events dashboard
4. **Browse Events**: Use the dashboard to view all available events with filtering options
5. **Register for Events**: Click "Register Now" on any event to fill out event-specific registration form (pre-filled with your details)
6. **View My Events**: Use "My Events" to see registered events, cancel registrations, and view reminders
7. **Manage Profile**: Use "Profile" to update personal information, view activity stats, and manage account settings
8. **Logout**: Use the "Logout" link in the navigation to end your session

## Authentication Flow

- **Public Access**: Only the home page (`index.html`) is accessible without login
- **Protected Pages**: Dashboard, My Events, and Event Registration require authentication
- **Auto-Redirect**: Unauthenticated users are automatically redirected to login page
- **Session Management**: User data is stored locally and persists across page visits
- **Logout**: Clears session data and returns to home page

## Page Features

### Home Page (`index.html`)
- Project vision and overview
- Key features showcase
- Navigation to all sections

### User Registration (`login.html`)
- Complete registration form with validation
- Email, phone, college selection
- OTP verification system

### Events Dashboard (`dashboard.html`)
- Filter events by type (All, Hackathons, Workshops, Tech Talks)
- Event cards with details and registration links
- Distance-based event display

### Event Registration (`event-registration.html`)
- Detailed event information
- Comprehensive registration form
- Year of study, branch, terms acceptance
- Form validation and confirmation

### My Events (`my-events.html`)
- List of registered events with status
- Registration IDs and event details
- Cancel registration functionality
- Upcoming event reminders

### Profile (`profile.html`)
- **Personal Information**: Edit name, email, phone, college, year, branch, interests
- **Activity Statistics**: Events registered, attended, account age, favorite categories
- **Account Settings**: Email/SMS notifications, profile visibility preferences
- **Account Management**: Delete account option with confirmation

## Example UI Flow (Text-Based)

Landing Page: "Discover tech events near you in Kerala."

Login/Signup:

Name: [__________]

Email: [__________]

Phone: [__________] [Send OTP]

OTP: [______]

College: [Start typing college name...]

[Find Events]

## Development Roadmap

### Phase 1: Frontend Prototype (Current)
- ✅ Landing page with project vision
- ✅ User registration form
- ✅ Events dashboard with filtering
- ✅ Responsive design
- ✅ Sample events data

### Phase 2: Backend Integration
- Database setup (PostgreSQL/PostGIS)
- User authentication
- College geocoding
- Dynamic event loading
- Admin panel for event management

### Phase 3: Advanced Features
- Real geolocation services
- Email notifications
- College representative accounts
- Event submission system
- Mobile app version

## Technology Stack (Planned)

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express or Python with Django
- **Database**: PostgreSQL with PostGIS for geolocation
- **Geocoding**: Google Maps API or OpenCage Geocoder
- **Hosting**: Vercel/Netlify (frontend), Heroku/AWS (backend)

## Sample Colleges Included
- College of Engineering Trivandrum
- Government Engineering College Thrissur
- Mar Athanasius College of Engineering
- Rajagiri School of Engineering & Technology
- Federal Institute of Science And Technology
- And many more Kerala institutions

## Contributing
This is a student project aimed at benefiting the Kerala tech community. Contributions and feedback are welcome!

## License
Open source - feel free to use and modify for educational purposes.