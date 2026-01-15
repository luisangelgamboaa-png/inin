const countries = [
    { id: 'esp', name: 'España', cost: 50, income: 2, icon: '🇪🇸' },
    { id: 'mex', name: 'México', cost: 250, income: 12, icon: '🇲🇽' },
    { id: 'usa', name: 'EE.UU', cost: 1000, income: 60, icon: '🇺🇸' },
    { id: 'ger', name: 'Alemania', cost: 5000, income: 280, icon: '🇩🇪' },
    { id: 'jpn', name: 'Japón', cost: 25000, income: 1100, icon: '🇯🇵' }
];

let gameState = {
    money: 0,
    owned: { esp: 0, mex: 0, usa: 0, ger: 0, jpn: 0 }
};

// Cargar juego al iniciar
if (localStorage.getItem('globalTycoonSave')) {
    gameState = JSON.parse(localStorage.getItem('globalTycoonSave'));
}

function updateUI() {
    document.getElementById('money').innerText = `$${Math.floor(gameState.money).toLocaleString()}`;
    
    let totalIncome = 0;
    countries.forEach(c => {
        totalIncome += gameState.owned[c.id] * c.income;
    });
    document.getElementById('mps').innerText = totalIncome.toLocaleString();

    const grid = document.getElementById('countries-grid');
    grid.innerHTML = '';

    countries.forEach(c => {
        const currentCost = Math.floor(c.cost * Math.pow(1.15, gameState.owned[c.id]));
        const card = document.createElement('div');
        card.className = 'country-card';
        card.innerHTML = `
            <div style="font-size: 2rem">${c.icon}</div>
            <h3>${c.name} (Nivel ${gameState.owned[c.id]})</h3>
            <p>Genera: $${c.income}/s</p>
            <button class="buy-btn" 
                ${gameState.money < currentCost ? 'disabled' : ''} 
                onclick="buyCountry('${c.id}', ${currentCost})">
                Invertir $${currentCost.toLocaleString()}
            </button>
        `;
        grid.appendChild(card);
    });
}

window.buyCountry = (id, cost) => {
    if (gameState.money >= cost) {
        gameState.money -= cost;
        gameState.owned[id]++;
        save();
        updateUI();
    }
};

document.getElementById('main-clicker').onclick = () => {
    gameState.money += 1;
    updateUI();
};

function save() {
    localStorage.setItem('globalTycoonSave', JSON.stringify(gameState));
}

// Bucle de dinero (cada 1 segundo)
setInterval(() => {
    let income = 0;
    countries.forEach(c => income += gameState.owned[c.id] * c.income);
    gameState.money += income;
    updateUI();
}, 1000);

updateUI();
