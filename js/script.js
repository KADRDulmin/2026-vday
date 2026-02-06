// Configuration Data - Colombo Edition 🇱🇰
const OPTIONS = {
    food: [
        { id: 'crab', name: 'Ministry of Crab (Fine Dining)', img: 'assets/img/food/crab.png' },
        { id: 'hoppers', name: 'Egg Hoppers & Sambol', img: 'assets/img/food/hoppers.png' },
        { id: 'kottu', name: 'Chicken Cheese Kottu', img: 'assets/img/food/kottu.png' },
        { id: 'lamprais', name: 'Authentic Lamprais', img: 'assets/img/food/lamprais.png' },
        { id: 'pizza', name: 'Giovanni\'s Woodfire Pizza', img: 'assets/img/food/pizza.png' },
        { id: 'burger', name: 'Gourmet Burger (Street Burger)', img: 'assets/img/food/burger.png' },
        { id: 'sushi', name: 'Premium Sushi (Zen/Ginza)', img: 'assets/img/food/sushi.png' },
        { id: 'korean', name: 'Korean BBQ Feast', img: 'assets/img/food/korean.png' }
    ],
    dessert: [
        { id: 'tresleches', name: 'Tres Leches (Butter Boutique)', img: 'assets/img/dessert/tresleches.png' },
        { id: 'strawberries', name: 'Strawberries & Cream (Jagro)', img: 'assets/img/dessert/strawberries.png' },
        { id: 'cheesecake', name: 'Blueberry Cheesecake', img: 'assets/img/dessert/cheesecake.png' },
        { id: 'cremebrulee', name: 'Crème Brûlée', img: 'assets/img/dessert/cremebrulee.png' },
        { id: 'boba', name: 'Brown Sugar Boba', img: 'assets/img/placeholder.svg' },
        { id: 'watalappam', name: 'Watalappam', img: 'assets/img/placeholder.svg' },
        { id: 'falooda', name: 'Falooda with Ice Cream', img: 'assets/img/placeholder.svg' },
        { id: 'coffee', name: 'Cafe Date (Barista/Java)', img: 'assets/img/placeholder.svg' },
        { id: 'thambili', name: 'King Coconut (Thambili)', img: 'assets/img/placeholder.svg' }
    ],
    activities: [
        { id: 'bowling', name: 'Bowling (Excel World)', img: 'assets/img/placeholder.svg' },
        { id: 'arcade', name: 'Arcade Date (CCC)', img: 'assets/img/placeholder.svg' },
        { id: 'sunset', name: 'Galle Face Sunset Walk', img: 'assets/img/placeholder.svg' },
        { id: 'cinema', name: 'Movie Night (Scope/PVR)', img: 'assets/img/placeholder.svg' },
        { id: 'park', name: 'Viharamahadevi Park Picnic', img: 'assets/img/placeholder.svg' },
        { id: 'tuktuk', name: 'City Tuk-Tuk Tour', img: 'assets/img/placeholder.svg' },
        { id: 'temple', name: 'Gangaramaya Temple Visit', img: 'assets/img/placeholder.svg' }
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
            document.querySelector('button');

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
            // Add Header
            const header = document.createElement('h3');
            header.innerText = "✨ Select everything you like! (Multiple Choice)";
            header.style.width = '100%';
            header.style.textAlign = 'center';
            header.style.color = 'var(--text-color)';
            header.style.marginBottom = '20px';
            container.parentNode.insertBefore(header, container);

            renderOptions(container, OPTIONS[type], type);
        }
    }

    // 4. Date Page Logic
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            saveData('date', e.target.value);
        });
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
    container.innerHTML = '';

    const currentData = JSON.parse(localStorage.getItem('vday_data') || '{}');
    const selectedItems = currentData[type] || [];

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        if (selectedItems.includes(item.name)) {
            card.classList.add('selected');
        }

        // Click handler for card
        card.addEventListener('click', (e) => {
            if (e.target.tagName === 'INPUT') return;
            const checkbox = card.querySelector('input');
            checkbox.checked = !checkbox.checked;
            toggleSelection(card, type, item.name, checkbox.checked);
        });

        const isChecked = selectedItems.includes(item.name) ? 'checked' : '';

        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <label style="pointer-events: none;">
                <input type="checkbox" name="${type}" value="${item.name}" ${isChecked} style="pointer-events: auto;">
                ${item.name}
            </label>
        `;

        // Direct checkbox listener
        const input = card.querySelector('input');
        input.addEventListener('change', () => {
            toggleSelection(card, type, item.name, input.checked);
        });

        container.appendChild(card);
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
}

function toggleSelection(card, type, value, isChecked) {
    if (isChecked) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }

    const data = JSON.parse(localStorage.getItem('vday_data') || '{}');
    if (!data[type]) data[type] = [];

    if (isChecked) {
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
