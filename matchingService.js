// Remove the sampleRides array and replace with API calls

async function findMatches() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentRide = {
        pickup: document.getElementById('result-pickup').textContent,
        airport: document.getElementById('result-airport').textContent,
        date: document.getElementById('result-date').textContent,
        time: document.getElementById('result-time').textContent
    };

    try {
        // Fetch matching rides from the database through our API
        const response = await fetch('/api/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.id,
                ...currentRide
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch matches');
        }

        const matches = await response.json();
        console.log('Matches found:', matches);
        displayMatches(matches);
        
    } catch (error) {
        console.error('Error finding matches:', error);
        document.getElementById('matches-container').innerHTML = 
            '<p class="error">Error finding matches. Please try again.</p>';
    }
}

function getMinutesDiff(time1, time2) {
    // Convert times to Date objects for easier comparison
    const [time1Clean, ampm1] = time1.split(/\s+/);
    const [time2Clean, ampm2] = time2.split(/\s+/);
    
    const [hours1, minutes1] = time1Clean.split(':').map(Number);
    const [hours2, minutes2] = time2Clean.split(':').map(Number);
    
    // Adjust hours for PM times
    const adjustedHours1 = (ampm1 === 'PM' && hours1 !== 12) ? hours1 + 12 : hours1;
    const adjustedHours2 = (ampm2 === 'PM' && hours2 !== 12) ? hours2 + 12 : hours2;
    
    return (adjustedHours1 * 60 + minutes1) - (adjustedHours2 * 60 + minutes2);
}

function displayMatches(matches) {
    const container = document.getElementById('matches-container');
    
    if (matches.length === 0) {
        container.innerHTML = `
            <div class="waitlist-section">
                <h3>No Matches Found</h3>
                <p>Would you like to join the waitlist? We'll notify you when a matching ride becomes available.</p>
                <button class="waitlist-btn" onclick="joinWaitlist()">Join Waitlist</button>
            </div>
        `;
        return;
    }

    const matchesHTML = matches.map(match => `
        <div class="match-card">
            <h3>${match.userName}</h3>
            <p>Time: ${match.time}</p>
            <p>Time Difference: ${Math.abs(getMinutesDiff(document.getElementById('result-time').textContent, match.time))} minutes</p>
        </div>
    `).join('');

    container.innerHTML = matchesHTML;
}

async function joinWaitlist() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentRide = {
        userId: currentUser.id,
        pickup: document.getElementById('result-pickup').textContent,
        airport: document.getElementById('result-airport').textContent,
        date: document.getElementById('result-date').textContent,
        time: document.getElementById('result-time').textContent
    };

    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentRide)
        });

        if (!response.ok) {
            throw new Error('Failed to join waitlist');
        }

        alert('You have been added to the waitlist. We will notify you when a matching ride becomes available.');
        
    } catch (error) {
        console.error('Error joining waitlist:', error);
        alert('Error joining waitlist. Please try again.');
    }
}

function showAllMatches() {
    const allMatches = document.getElementById('all-matches');
    allMatches.style.display = 'block';
    document.querySelector('.waitlist-section').style.display = 'none';
} 