// Game state
let choices = [];
let selectedChoiceIndex = null;
let cupPositions = []; // Track which cup is at which position
let isShuffling = false;

// Color palette for cups
const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B88B', '#52C41A'
];

// Add choice
function addChoice() {
    const input = document.getElementById('choiceInput');
    const choice = input.value.trim();

    if (choice === '') {
        alert('Please enter a choice!');
        return;
    }

    if (choices.includes(choice)) {
        alert('This choice already exists!');
        return;
    }

    choices.push(choice);
    input.value = '';
    updateUI();
}

// Remove choice
function removeChoice(index) {
    choices.splice(index, 1);
    updateUI();
}

// Handle Enter key
function handleEnter(event) {
    if (event.key === 'Enter') {
        addChoice();
    }
}

// Update UI based on game state
function updateUI() {
    const choicesList = document.getElementById('choicesList');
    const gameSection = document.getElementById('gameSection');
    const emptyState = document.getElementById('emptyState');

    choicesList.innerHTML = '';

    if (choices.length === 0) {
        emptyState.style.display = 'block';
        gameSection.classList.remove('active');
        return;
    }

    emptyState.style.display = 'none';

    // Display choices
    choices.forEach((choice, index) => {
        const item = document.createElement('div');
        item.className = 'choice-item';
        const color = colors[index % colors.length];
        item.innerHTML = `
            <div class="choice-color" style="background-color: ${color}"></div>
            <span>${choice}</span>
            <button onclick="removeChoice(${index})">Remove</button>
        `;
        choicesList.appendChild(item);
    });

    if (choices.length >= 2) {
        gameSection.classList.add('active');
        renderCups();
    }
}

// Render cups
function renderCups() {
    const cupsContainer = document.getElementById('cupsContainer');
    cupsContainer.innerHTML = '';

    // Initialize cup positions (index -> position mapping)
    cupPositions = Array.from({length: choices.length}, (_, i) => i);

    choices.forEach((choice, index) => {
        const cup = document.createElement('div');
        cup.className = 'cup';
        cup.dataset.index = index;
        const color = colors[index % colors.length];
        const darkerColor = adjustBrightness(color, -20);

        cup.innerHTML = `
            <div class="cup-wrapper">
                <div class="cup-front">
                    <div class="cup-shape" style="background: linear-gradient(135deg, ${color}, ${darkerColor});">
                        <div class="cup-shine"></div>
                        <div class="cup-handle" style="color: ${color};"></div>
                    </div>
                </div>
                <div class="cup-back">
                    ${choice}
                </div>
            </div>
        `;

        cup.onclick = () => selectCup(cup);
        cupsContainer.appendChild(cup);
    });

    resetMessage();
}

// Adjust brightness of color
function adjustBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Get contrasting text color (dark or light)
function getContrastColor(hexColor) {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

// Start shuffle animation
function startShuffle() {
    if (isShuffling || choices.length < 2) return;

    isShuffling = true;
    document.getElementById('shuffleBtn').disabled = true;
    document.getElementById('message').textContent = '🎲 Shuffling...';

    // Pick a random choice to be selected
    selectedChoiceIndex = Math.floor(Math.random() * choices.length);

    // Perform random shuffles with actual cup swapping
    const cupsContainer = document.getElementById('cupsContainer');
    const cups = Array.from(document.querySelectorAll('.cup'));
    cups.forEach(cup => cup.classList.add('shuffling'));

    let shuffleCount = 0;
    const totalShuffles = 12; // Fixed number of shuffles for better control
    const animationDuration = 600; // milliseconds

    const shuffleInterval = setInterval(() => {
        // Random shuffle moves
        const moves = ['move-left', 'move-right', 'move-center'];

        cups.forEach(cup => {
            cup.classList.remove('move-left', 'move-right', 'move-center', 'move-lift');
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            cup.classList.add(randomMove);
        });

        // Perform random position swaps
        if (Math.random() > 0.2 && cups.length > 1) {
            const pos1 = Math.floor(Math.random() * cups.length);
            let pos2 = Math.floor(Math.random() * cups.length);
            while (pos2 === pos1) {
                pos2 = Math.floor(Math.random() * cups.length);
            }
            
            // Swap DOM elements
            const temp = cups[pos1];
            cups[pos1] = cups[pos2];
            cups[pos2] = temp;
            
            if (pos1 < pos2) {
                cupsContainer.insertBefore(cups[pos1], cups[pos2]);
            } else {
                cupsContainer.insertBefore(cups[pos2], cups[pos1]);
            }
            
            // Swap in tracking array
            [cupPositions[pos1], cupPositions[pos2]] = [cupPositions[pos2], cupPositions[pos1]];
        }

        shuffleCount++;

        if (shuffleCount >= totalShuffles) {
            clearInterval(shuffleInterval);
            setTimeout(() => endShuffle(cups), animationDuration + 100);
        }
    }, animationDuration + 50);
}

// End shuffle and automatically reveal a cup
function endShuffle(cups) {
    cups.forEach(cup => {
        cup.classList.remove('shuffling', 'move-left', 'move-right', 'move-center', 'move-lift');
    });

    document.getElementById('message').textContent = '🎯 Picking your choice...';
    
    // Find which position has the selected choice
    const selectedPosition = cupPositions.indexOf(selectedChoiceIndex);
    const selectedCup = cups[selectedPosition];

    // Lift the selected cup after a short delay
    setTimeout(() => {
        selectedCup.classList.add('revealed');
        
        setTimeout(() => {
            const choiceName = choices[selectedChoiceIndex];
            document.getElementById('message').textContent = `🎉 You got: ${choiceName}! 🎉`;
            document.getElementById('message').classList.add('winner');
            
            document.getElementById('shuffleBtn').style.display = 'none';
            document.getElementById('resetBtn').style.display = 'inline-block';
        }, 300);
    }, 400);

    document.getElementById('shuffleBtn').disabled = false;
    isShuffling = false;
}

// Select cup and reveal
function selectCup(cup) {
    if (isShuffling) return;
    
    if (!cup.classList.contains('revealed')) {
        cup.classList.add('revealed');
    } else {
        cup.classList.remove('revealed');
    }
}

// Reset game
function resetGame() {
    const cups = document.querySelectorAll('.cup');
    cups.forEach(cup => cup.classList.remove('revealed'));

    selectedChoiceIndex = null;
    cupPositions = Array.from({length: choices.length}, (_, i) => i);
    
    document.getElementById('shuffleBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
    resetMessage();
    
    // Rebuild the DOM to reset positions
    renderCups();
}

// Reset message
function resetMessage() {
    const message = document.getElementById('message');
    message.textContent = '';
    message.classList.remove('winner');
}

// Initialize
updateUI();
