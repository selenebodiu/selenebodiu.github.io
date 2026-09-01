// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active class to navigation items on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe learning cards and skill groups
document.querySelectorAll('.learning-card, .skill-group').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Mobile menu toggle (if needed in future)
const navMenu = document.querySelector('.nav-menu');
const navBrand = document.querySelector('.nav-brand');

// Highlight active navigation link
function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.style.color = 'var(--text-dark)';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--primary-color)';
            }
        });
    });
}

updateActiveLink();

// Add hover effect to learning cards
document.querySelectorAll('.learning-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.2)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 10px 30px rgba(37, 99, 235, 0.1)';
    });
});

// ==================== GREETING CARDS FUNCTIONALITY ====================

// Get DOM elements
const colleagueNameInput = document.getElementById('colleague-name');
const cardMessageInput = document.getElementById('card-message');
const cardThemeSelect = document.getElementById('card-theme');
const createCardBtn = document.querySelector('.create-card-btn');
const cardPreview = document.getElementById('card-preview');
const cardsContainer = document.getElementById('cards-container');
const clearCardsBtn = document.getElementById('clear-cards-btn');

// Theme emojis mapping
const themeEmojis = {
    sunny: '☀️',
    tropical: '🌴',
    mountain: '⛰️',
    colorful: '🎨',
    starry: '⭐',
    congrats: '🎉',
    birthday: '🎂',
    love: '💗'
};

const themeMessages = {
    sunny: 'Happy Summer!',
    tropical: 'Tropical Vibes!',
    mountain: 'Adventure Awaits!',
    colorful: 'Cheers to You!',
    starry: 'Wishing You Starry Days!',
    congrats: 'Congratulations!',
    birthday: 'Happy Birthday',
    love: 'With Love'
};

// Load cards from localStorage
let createdCards = JSON.parse(localStorage.getItem('greetingCards')) || [];

// Display stored cards on page load
displayCards();

// Update preview as user types
colleagueNameInput.addEventListener('input', updatePreview);
cardMessageInput.addEventListener('input', updatePreview);
cardThemeSelect.addEventListener('change', updatePreview);

// Create card button handler
createCardBtn.addEventListener('click', createCard);

// Clear all cards button
clearCardsBtn.addEventListener('click', clearAllCards);

function updatePreview() {
    const theme = cardThemeSelect.value;
    const message = cardMessageInput.value || 'Write your message here...';
    const name = colleagueNameInput.value || 'Friend';
    
    cardPreview.className = `greeting-card-preview ${theme}`;
    
    const cardFront = cardPreview.querySelector('.card-front');
    cardFront.innerHTML = `
        <div class="card-emoji">${themeEmojis[theme]}</div>
        <h3>${themeMessages[theme]}</h3>
    `;
    
    const cardBack = cardPreview.querySelector('.card-back');
    cardBack.innerHTML = `
        <p class="card-recipient">Dear ${name},</p>
        <p class="card-content">${message}</p>
        <p class="card-signature">- Selene</p>
    `;
}

function createCard() {
    const colleagueName = colleagueNameInput.value.trim();
    const message = cardMessageInput.value.trim();
    const theme = cardThemeSelect.value;
    
    if (!colleagueName || !message) {
        alert('Please enter both a colleague\'s name and message!');
        return;
    }
    
    const card = {
        id: Date.now(),
        name: colleagueName,
        message: message,
        theme: theme,
        timestamp: new Date().toLocaleString()
    };
    
    createdCards.push(card);
    localStorage.setItem('greetingCards', JSON.stringify(createdCards));
    
    // Clear form
    colleagueNameInput.value = '';
    cardMessageInput.value = '';
    cardThemeSelect.value = 'sunny';
    updatePreview();
    
    // Display cards
    displayCards();
    
    // Show success message
    showSuccessMessage('Card created! 🎉');
}

function displayCards() {
    if (createdCards.length === 0) {
        cardsContainer.innerHTML = '<p class="empty-state">Create your first greeting card to get started! 🎉</p>';
        clearCardsBtn.style.display = 'none';
    } else {
        clearCardsBtn.style.display = 'block';
        cardsContainer.innerHTML = '';
        
        createdCards.forEach(card => {
            const cardElement = createCardElement(card);
            cardsContainer.appendChild(cardElement);
        });
    }
}

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-wrapper';
    
    const cardHTML = `
        <div class="greeting-card-preview ${card.theme}">
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-emoji">${themeEmojis[card.theme]}</div>
                    <h3>${themeMessages[card.theme]}</h3>
                </div>
                <div class="card-back">
                    <p class="card-recipient">Dear ${card.name},</p>
                    <p class="card-content">${card.message}</p>
                    <p class="card-signature">- Selene</p>
                </div>
            </div>
        </div>
        <div class="card-actions">
            <button class="card-btn download-btn" onclick="downloadCard('${card.id}')">📥 Download</button>
            <button class="card-btn delete-btn" onclick="deleteCard('${card.id}')">🗑️ Delete</button>
        </div>
        <p style="text-align: center; font-size: 0.9rem; color: #6b7280; margin-top: 0.5rem;">${card.name}</p>
    `;
    
    cardDiv.innerHTML = cardHTML;
    return cardDiv;
}

function deleteCard(cardId) {
    createdCards = createdCards.filter(card => card.id != cardId);
    localStorage.setItem('greetingCards', JSON.stringify(createdCards));
    displayCards();
    showSuccessMessage('Card deleted');
}

function clearAllCards() {
    if (confirm('Are you sure you want to delete all greeting cards?')) {
        createdCards = [];
        localStorage.setItem('greetingCards', JSON.stringify(createdCards));
        displayCards();
        showSuccessMessage('All cards cleared');
    }
}

function downloadCard(cardId) {
    const card = createdCards.find(c => c.id == cardId);
    if (!card) return;
    
    const cardText = `
╔══════════════════════════════════════╗
║                                      ║
║  ${themeEmojis[card.theme]}  ${themeMessages[card.theme].padEnd(26)}  ${themeEmojis[card.theme]}  ║
║                                      ║
║  Dear ${card.name.padEnd(28)},  ║
║                                      ║
║  ${card.message.substring(0, 32).padEnd(32)}║
${card.message.length > 32 ? `║  ${card.message.substring(32, 64).padEnd(32)}║\n` : ''}
║                                      ║
║  - Selene                            ║
║                                      ║
╚══════════════════════════════════════╝
    `;
    
    // Create and trigger download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(cardText));
    element.setAttribute('download', `greeting-card-${card.name.replace(/\s+/g, '-').toLowerCase()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showSuccessMessage('Card downloaded! 📥');
}

function showSuccessMessage(message) {
    // Create a temporary success message
    const tempDiv = document.createElement('div');
    tempDiv.textContent = message;
    tempDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(tempDiv);
    
    setTimeout(() => {
        tempDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => document.body.removeChild(tempDiv), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('Portfolio website with greeting cards loaded successfully!');
