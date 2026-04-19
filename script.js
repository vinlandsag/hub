// Kerala Events Hub JavaScript

const API_BASE = window.location.hostname ? `http://${window.location.hostname}:3000` : 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters for user info
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name') || 'Student';
    const userCollege = urlParams.get('college') || 'Your College';
    const eventParam = urlParams.get('event');

    // Update user info
    const userNameElement = document.getElementById('user-name');
    const userCollegeElement = document.getElementById('user-college');

    if (userNameElement) userNameElement.textContent = userName;
    if (userCollegeElement) userCollegeElement.textContent = userCollege;

    // Event filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterLocationInput = document.getElementById('filter-location');
    const filterDistanceSelect = document.getElementById('filter-distance');
    
    let currentFilterType = 'all';

    function applyFilters() {
        const locationQuery = filterLocationInput ? filterLocationInput.value.toLowerCase() : '';
        const maxDistance = filterDistanceSelect ? filterDistanceSelect.value : 'all';
        
        // Query event cards dynamically in case they were fetched from backend
        const eventCards = document.querySelectorAll('.event-card');

        eventCards.forEach(card => {
            const cardType = card.dataset.type || '';
            const cardLocation = (card.dataset.location || '').toLowerCase();
            const cardDistance = parseInt(card.dataset.distance) || 0;
            
            // Type Match
            const matchesType = currentFilterType === 'all' || cardType === currentFilterType;
            
            // Location Match
            const matchesLocation = locationQuery === '' || cardLocation.includes(locationQuery);
            
            // Distance Match
            const matchesDistance = maxDistance === 'all' || cardDistance <= parseInt(maxDistance);

            if (matchesType && matchesLocation && matchesDistance) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            currentFilterType = this.id.replace('filter-', '');
            applyFilters();
        });
    });

    if (filterLocationInput) {
        filterLocationInput.addEventListener('input', applyFilters);
    }
    
    if (filterDistanceSelect) {
        filterDistanceSelect.addEventListener('change', applyFilters);
    }

    // OTP functionality
    const sendOtpBtn = document.getElementById('send-otp');
    const otpInput = document.getElementById('otp');
    const phoneInput = document.getElementById('phone');

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', function() {
            const phone = phoneInput.value;
            if (phone.length === 10 && /^\d+$/.test(phone)) {
                // Simulate OTP sending
                const otp = Math.floor(100000 + Math.random() * 900000);
                alert(`OTP sent to ${phone}: ${otp}`);
                otpInput.value = otp; // For demo purposes - in real app, user enters manually
                sendOtpBtn.textContent = 'OTP Sent';
                sendOtpBtn.disabled = true;
                setTimeout(() => {
                    sendOtpBtn.textContent = 'Send OTP';
                    sendOtpBtn.disabled = false;
                }, 30000); // Re-enable after 30 seconds
            } else {
                alert('Please enter a valid 10-digit phone number');
            }
        });
    }

    // Form validation
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const phone = phoneInput.value;
            const otp = otpInput.value;

            if (phone.length !== 10 || !/^\d+$/.test(phone)) {
                alert('Please enter a valid 10-digit phone number');
                e.preventDefault();
                return;
            }

            if (otp.length !== 6 || !/^\d+$/.test(otp)) {
                alert('Please enter a valid 6-digit OTP');
                e.preventDefault();
                return;
            }

            // If all validations pass, form will submit
        });
    }

    // Event registration form handling
    const eventRegForm = document.getElementById('event-reg-form');
    if (eventRegForm) {
        eventRegForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(eventRegForm);
            const registrationData = Object.fromEntries(formData);

            // Retrieve the stored user from local storage
            const storedUser = JSON.parse(localStorage.getItem('keralaEventsUser') || '{}');
            // Fallback to ID 1 if the user hasn't been registered in the real DB yet
            const userId = storedUser.id || 1;

            // Map frontend string event IDs to backend database integer IDs
            const eventIdMap = {
                'codewars': 1,
                'aiml': 2,
                'flutter': 3,
                'webdev': 4
            };
            const dbEventId = !isNaN(eventParam) ? parseInt(eventParam) : (eventIdMap[eventParam] || 1);

            try {
                const response = await fetch(`${API_BASE}/api/event-registration`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: userId, eventId: dbEventId })
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Successfully registered for the event!\n\nRegistration ID: REG00${result.id}`);
                    window.location.href = 'my-events.html';
                } else {
                    const errorData = await response.json();
                    alert(`Registration failed: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('Could not connect to the server. Is the backend running?');
            }
        });
    }

    // Load event details based on URL parameter
    if (eventParam) {
        loadEventDetails(eventParam);
    }

    // Use event delegation for cancel registration buttons so it works with dynamic data
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-danger') && e.target.textContent.includes('Cancel')) {
            if (confirm('Are you sure you want to cancel your registration for this event?')) {
                // Simulate cancellation
                const card = e.target.closest('.registered-event-card');
                if (card) {
                    card.remove();
                    updateEventCount();
                    alert('Registration cancelled successfully.');
                }
            }
        }
    });

    updateEventCount();

    // Fetch real events from database if on dashboard
    if (typeof fetchDashboardEvents === 'function') {
        fetchDashboardEvents();
    }

    // Fetch my events if on my-events page
    if (typeof fetchMyEvents === 'function') {
        fetchMyEvents();
    }

    console.log('Kerala Events Hub loaded successfully!');
});

// Function to load event details
async function loadEventDetails(eventId) {
    // If eventId is a number, fetch from backend API
    if (!isNaN(eventId)) {
        try {
            const response = await fetch(`${API_BASE}/api/events/${eventId}`);
            if (response.ok) {
                const event = await response.json();
                document.getElementById('event-title').textContent = event.title;
                document.getElementById('event-college').textContent = event.college_name;
                document.getElementById('event-date').textContent = new Date(event.date).toLocaleDateString();
                document.getElementById('event-time').textContent = 'Time TBA';
                document.getElementById('event-venue').textContent = `${event.college_name} Campus`;
                document.getElementById('event-type').textContent = event.type.charAt(0).toUpperCase() + event.type.slice(1);
                document.getElementById('event-description').textContent = event.description;
                return; // Exit function so we don't use hardcoded fallback
            }
        } catch (error) {
            console.error('Error fetching event details:', error);
        }
    }

    // Fallback to hardcoded events for prototype string IDs
    const events = {
        codewars: {
            title: 'Code Wars 2.0',
            college: 'Federal Institute of Science And Technology',
            date: 'August 25, 2024',
            time: '9:00 AM - 9:00 PM',
            venue: 'FISAT Main Auditorium',
            type: 'Hackathon',
            description: 'A 24-hour coding competition featuring challenges in algorithms, web development, and machine learning. Teams of 2-4 members can participate. Prizes worth ₹50,000 to be won!'
        },
        aiml: {
            title: 'AI/ML Bootcamp',
            college: 'Rajagiri School of Engineering & Technology',
            date: 'September 2, 2024',
            time: '10:00 AM - 5:00 PM',
            venue: 'Rajagiri Tech Park',
            type: 'Workshop',
            description: 'Learn the fundamentals of Artificial Intelligence and Machine Learning with hands-on projects. No prior experience required. Certificate of completion provided.'
        },
        flutter: {
            title: 'Flutter Fest',
            college: 'College of Engineering Trivandrum',
            date: 'August 30, 2024',
            time: '2:00 PM - 6:00 PM',
            venue: 'CET Seminar Hall',
            type: 'Workshop',
            description: 'Build beautiful, natively compiled applications for mobile from a single codebase. Learn Flutter framework with Dart programming language.'
        },
        webdev: {
            title: 'Future of Web Development',
            college: 'Model Engineering College',
            date: 'September 5, 2024',
            time: '3:00 PM - 5:00 PM',
            venue: 'MEC Auditorium',
            type: 'Tech Talk',
            description: 'Explore emerging trends in web development including Web3, PWAs, and modern frameworks. Guest speaker from Google Developer Relations.'
        }
    };

    const event = events[eventId];
    if (event) {
        document.getElementById('event-title').textContent = event.title;
        document.getElementById('event-college').textContent = event.college;
        document.getElementById('event-date').textContent = event.date;
        document.getElementById('event-time').textContent = event.time;
        document.getElementById('event-venue').textContent = event.venue;
        document.getElementById('event-type').textContent = event.type;
        document.getElementById('event-description').textContent = event.description;
    }
}

// Function to update event count
function updateEventCount() {
    const eventCountElement = document.getElementById('event-count');
    const registeredEvents = document.querySelectorAll('.registered-event-card');

    if (eventCountElement) {
        eventCountElement.textContent = registeredEvents.length;
    }
}