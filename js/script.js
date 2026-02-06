// Configuration Data
const OPTIONS = {
    food: [
        { id: 'burgers', name: 'Burgers & Chicken', img: 'food/burgers.jpeg' },
        { id: 'hotdog', name: 'Hotdog', img: 'food/dog.jpeg' },
        { id: 'korean', name: 'Korean Food', img: 'food/koreanfood.jpeg' },
        { id: 'pasta', name: 'Pasta', img: 'food/pasta.jpeg' },
        { id: 'pizza', name: 'Pizza', img: 'food/pizza.jpeg' },
        { id: 'salad', name: 'Salad', img: 'food/salad.jpeg' },
        { id: 'steak', name: 'Steak', img: 'food/steak.jpeg' },
        { id: 'sushi', name: 'Sushi', img: 'food/sushi.jpeg' }
    ],
    dessert: [
        { id: 'boba', name: 'Boba', img: 'food/boba.jpeg' },
        { id: 'churro', name: 'Churro', img: 'food/churro.jpeg' },
        { id: 'che', name: 'Che', img: 'food/che.jpeg' },
        { id: 'mochi', name: 'Mochi', img: 'food/mochi.jpeg' },
        { id: 'randombun', name: 'Random Bun', img: 'food/randombun.jpeg' },
        { id: 'taiyaki', name: 'Taiyaki', img: 'food/taiyaki.jpeg' }
    ],
    activities: [
        { id: 'aquarium', name: 'Aquarium', img: 'activities/aquarium.jpeg' },
        { id: 'arcade', name: 'Arcade', img: 'activities/arcade.jpeg' },
        { id: 'cinema', name: 'Cinema', img: 'activities/cinema.jpeg' },
        { id: 'ceramics', name: 'Ceramics', img: 'activities/keramika.jpeg' },
        { id: 'exhibition', name: 'Exhibition', img: 'activities/kunsthalle.jpeg' },
        { id: 'park', name: 'Park', img: 'activities/park.jpeg' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.split("/").pop();

    // 1. Observation Logic (Scroll Fade-in)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // 2. Index Page Logic ("No" Button)
    if (page === 'index.html' || page === '') {
        const noButton = document.getElementById('noButton');
        const yesButton = document.querySelector('.answerButton[onclick*="thankyou.html"]') ||
            document.querySelector('button'); // Robust fallback

        if (noButton && yesButton) {
            noButton.addEventListener('mouseover', () => moveButton(noButton));
            noButton.addEventListener('click', () => {
                let currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
                yesButton.style.fontSize = `${currentSize * 1.2}px`;
                moveButton(noButton);
            });
        }
    }

    // 3. Dynamic Rendering & Data Collection
    const container = document.getElementById('dynamic-container');

    if (container) {
        let type = '';
        if (page.includes('food')) type = 'food';
        else if (page.includes('dessert')) type = 'dessert';
        else if (page.includes('activities')) type = 'activities';

        if (type && OPTIONS[type]) {
            renderOptions(container, OPTIONS[type], type);
        }
    }

    // 4. Date Page Logic
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            saveData('date', e.target.value);
        });
        // Restore if exists
        const savedDate = JSON.parse(localStorage.getItem('vday_data') || '{}').date;
        if (savedDate) dateInput.value = savedDate;
    }

    // 5. Last Page Logic (Email)
    if (page.includes('lastpage.html')) {
        const emailBtn = document.getElementById('email-btn');
        if (emailBtn) {
            emailBtn.addEventListener('click', sendEmail);
        }
    }
});

function moveButton(elem) {
    const x = Math.random() * (window.innerWidth - elem.offsetWidth);
    const y = Math.random() * (window.innerHeight - elem.offsetHeight);

    elem.style.position = 'absolute';
    elem.style.left = `${x}px`;
    elem.style.top = `${y}px`;
}

function renderOptions(container, items, type) {
    container.innerHTML = ''; // Clear fallback content

    // Load saved state
    const currentData = JSON.parse(localStorage.getItem('vday_data') || '{}');
    const selectedItems = currentData[type] || [];

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.style.opacity = '0'; // Start hidden for fade-in
        card.style.transform = 'translateY(20px)';

        const isChecked = selectedItems.includes(item.name) ? 'checked' : '';

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <label>
                <input type="checkbox" name="${type}" value="${item.name}" ${isChecked}>
                ${item.name}
            </label>
        `;

        // Add event listener for realtime saving
        const input = card.querySelector('input');
        input.addEventListener('change', () => {
            updateSelection(type, item.name, input.checked);
        });

        container.appendChild(card);

        // Trigger generic animation
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
}

function updateSelection(type, value, isAdded) {
    const data = JSON.parse(localStorage.getItem('vday_data') || '{}');
    if (!data[type]) data[type] = [];

    if (isAdded) {
        if (!data[type].includes(value)) data[type].push(value);
    } else {
        data[type] = data[type].filter(item => item !== value);
    }

    localStorage.setItem('vday_data', JSON.stringify(data));
}

function saveData(key, value) {
    const data = JSON.parse(localStorage.getItem('vday_data') || '{}');
    data[key] = value;
    localStorage.setItem('vday_data', JSON.stringify(data));
}

function sendEmail() {
    const data = JSON.parse(localStorage.getItem('vday_data') || '{}');

    const date = data.date || "Not selected";
    const food = (data.food || []).join(', ') || "None";
    const dessert = (data.dessert || []).join(', ') || "None";
    const activities = (data.activities || []).join(', ') || "None";

    const subject = encodeURIComponent("My Valentine's Day Choices ❤️");
    const body = encodeURIComponent(`
Hi My King (The Bestest Boyfriend in the World) aka Raminda! 

Here are my choices for our Valentine's Day:

📅 Date: ${date}

🍔 Food: ${food}

🍦 Dessert: ${dessert}

🎡 Activities: ${activities}

Can't wait! (｡♥‿♥｡)
    `);

    window.location.href = `mailto:raminda5575@gmail.com?subject=${subject}&body=${body}`;
}
