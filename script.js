// Estado de la aplicación
const appState = {
    currentUser: null,
    favoriteGenre: null,
    currentTab: 'popular',
    uploadedAudio: null,
    currentInstrument: 'guitar'
};

// Elementos DOM
const elements = {
    loginBtn: document.getElementById('loginBtn'),
    userProfile: document.getElementById('userProfile'),
    loginModal: document.getElementById('loginModal'),
    audioUpload: document.getElementById('audioUpload'),
    linkUpload: document.getElementById('linkUpload'),
    linkInput: document.getElementById('linkInput'),
    instrumentSelect: document.getElementById('instrumentSelect'),
    sheetMusic: document.getElementById('sheetMusic'),
    sheetActions: document.getElementById('sheetActions'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    scoresGrid: document.querySelector('.scores-grid')
};

// Datos de ejemplo para partituras
const sampleScores = {
    popular: [
        {
            id: 1,
            title: "Hotel California - Eagles",
            instrument: "Guitarra",
            difficulty: "Intermedio",
            artist: "Eagles",
            genre: "Rock",
            views: 15420,
            rating: 4.8
        },
        {
            id: 2,
            title: "Bohemian Rhapsody - Queen",
            instrument: "Piano",
            difficulty: "Avanzado",
            artist: "Queen",
            genre: "Rock",
            views: 12850,
            rating: 4.9
        },
        {
            id: 3,
            title: "Billie Jean - Michael Jackson",
            instrument: "Bajo",
            difficulty: "Principiante",
            artist: "Michael Jackson",
            genre: "Pop",
            views: 11230,
            rating: 4.5
        }
    ],
    recommended: [
        {
            id: 4,
            title: "Take Five - Dave Brubeck",
            instrument: "Saxofón",
            difficulty: "Intermedio",
            artist: "Dave Brubeck",
            genre: "Jazz",
            views: 8650,
            rating: 4.7
        },
        {
            id: 5,
            title: "Für Elise - Beethoven",
            instrument: "Piano",
            difficulty: "Principiante",
            artist: "Beethoven",
            genre: "Clásica",
            views: 9540,
            rating: 4.6
        }
    ],
    community: [
        {
            id: 6,
            title: "Mi Canción Original",
            instrument: "Guitarra",
            difficulty: "Intermedio",
            artist: "Usuario123",
            genre: "Rock",
            views: 320,
            rating: 4.2,
            userCreated: true
        },
        {
            id: 7,
            title: "Cover Acústico - Shape of You",
            instrument: "Piano",
            difficulty: "Principiante",
            artist: "MusicLover",
            genre: "Pop",
            views: 540,
            rating: 4.4,
            userCreated: true
        }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    loadPopularScores();
    checkAuthState();
}

function setupEventListeners() {
    // Autenticación
    elements.loginBtn.addEventListener('click', showLoginModal);
    document.querySelector('.close').addEventListener('click', hideLoginModal);
    document.querySelector('.google-login-btn').addEventListener('click', handleGoogleLogin);
    
    // Navegación por pestañas
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Subida de archivos
    elements.audioUpload.addEventListener('click', triggerAudioUpload);
    elements.linkUpload.addEventListener('click', showLinkInput);
    
    // Selección de instrumento
    elements.instrumentSelect.addEventListener('change', (e) => {
        appState.currentInstrument = e.target.value;
    });
    
    // Selección de género
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.addEventListener('click', (e) => selectGenre(e.target.dataset.genre));
    });
    
    // Cerrar modal al hacer clic fuera
    elements.loginModal.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) {
            hideLoginModal();
        }
    });
}

// Sistema de Autenticación (Simulado)
function checkAuthState() {
    const savedUser = localStorage.getItem('musicTranscriberUser');
    if (savedUser) {
        appState.currentUser = JSON.parse(savedUser);
        updateUIForAuth();
    }
}

function showLoginModal() {
    elements.loginModal.classList.remove('hidden');
}

function hideLoginModal() {
    elements.loginModal.classList.add('hidden');
}

function selectGenre(genre) {
    appState.favoriteGenre = genre;
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.genre === genre);
    });
}

function handleGoogleLogin() {
    if (!appState.favoriteGenre) {
        alert('Por favor, selecciona tu género musical favorito');
        return;
    }
    
    // Simulación de login con Google
    const user = {
        name: 'Usuario Demo',
        email: 'usuario@demo.com',
        avatar: 'https://via.placeholder.com/40',
        favoriteGenre: appState.favoriteGenre,
        joined: new Date().toISOString()
    };
    
    appState.currentUser = user;
    localStorage.setItem('musicTranscriberUser', JSON.stringify(user));
    updateUIForAuth();
    hideLoginModal();
    
    showNotification(`¡Bienvenido ${user.name}! Género favorito: ${getGenreName(user.favoriteGenre)}`);
}

function updateUIForAuth() {
    elements.loginBtn.classList.add('hidden');
    elements.userProfile.classList.remove('hidden');
    
    const userName = elements.userProfile.querySelector('.user-name');
    const userAvatar = elements.userProfile.querySelector('.user-avatar');
    
    userName.textContent = appState.currentUser.name;
    userAvatar.src = appState.currentUser.avatar;
    userAvatar.alt = appState.currentUser.name;
}

function getGenreName(genreKey) {
    const genres = {
        rock: 'Rock',
        jazz: 'Jazz',
        classical: 'Música Clásica',
        pop: 'Pop',
        electronic: 'Electrónica',
        metal: 'Metal'
    };
    return genres[genreKey] || genreKey;
}

// Sistema de Partituras
function triggerAudioUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = handleAudioUpload;
    input.click();
}

function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file) {
        appState.uploadedAudio = file;
        simulateTranscription(file);
    }
}

function showLinkInput() {
    elements.linkInput.classList.remove('hidden');
    const input = elements.linkInput.querySelector('input');
    input.focus();
    
    elements.linkInput.querySelector('.transcribe-btn').onclick = () => {
        const url = input.value.trim();
        if (url) {
            simulateTranscription(url);
        }
    };
}

function simulateTranscription(source) {
    showNotification('Analizando audio... Esto puede tomar unos momentos.');
    
    // Simulación de procesamiento
    setTimeout(() => {
        generateSampleSheetMusic();
        elements.sheetActions.classList.remove('hidden');
        showNotification('Partitura generada exitosamente!');
    }, 2000);
}

function generateSampleSheetMusic() {
    const instrument = appState.currentInstrument;
    const instrumentNames = {
        guitar: 'Guitarra',
        piano: 'Piano',
        bass: 'Bajo',
        drums: 'Batería',
        violin: 'Violín',
        saxophone: 'Saxofón'
    };
    
    elements.sheetMusic.innerHTML = `
        <div class="sheet-music-preview">
            <h3>Partitura de ${instrumentNames[instrument]}</h3>
            <div class="music-notation">
                <div class="staff">
                    <pre>
    ♪   ♩   ♫   ♬
    -----------------
    |   Do  Re  Mi  |
    |   ●   ●   ●   |
    |   |   |   |   |
    -----------------
                    </pre>
                </div>
            </div>
            <div class="sheet-info">
                <p><strong>Instrumento:</strong> ${instrumentNames[instrument]}</p>
                <p><strong>Tonalidad:</strong> Do Mayor</p>
                <p><strong>Compás:</strong> 4/4</p>
                <p><strong>Dificultad:</strong> Intermedio</p>
            </div>
        </div>
    `;
}

// Sistema de Exploración
function switchTab(tabName) {
    appState.currentTab = tabName;
    
    // Actualizar botones de pestaña
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Cargar contenido de la pestaña
    loadScoresForTab(tabName);
}

function loadPopularScores() {
    loadScoresForTab('popular');
}

function loadScoresForTab(tabName) {
    const scores = sampleScores[tabName] || [];
    elements.scoresGrid.innerHTML = '';
    
    scores.forEach(score => {
        const scoreElement = createScoreCard(score);
        elements.scoresGrid.appendChild(scoreElement);
    });
}

function createScoreCard(score) {
    const card = document.createElement('div');
    card.className = 'score-card';
    card.innerHTML = `
        <div class="score-header">
            <h3>${score.title}</h3>
            ${score.userCreated ? '<span class="user-badge">Comunidad</span>' : ''}
        </div>
        <div class="score-info">
            <p><i class="fas fa-guitar"></i> ${score.instrument}</p>
            <p><i class="fas fa-user"></i> ${score.artist}</p>
            <p><i class="fas fa-music"></i> ${score.genre}</p>
            <p><i class="fas fa-signal"></i> Dificultad: ${score.difficulty}</p>
        </div>
        <div class="score-stats">
            <span><i class="fas fa-eye"></i> ${score.views.toLocaleString()}</span>
            <span><i class="fas fa-star"></i> ${score.rating}</span>
        </div>
        <button class="view-score-btn" onclick="viewScore(${score.id})">
            Ver Partitura
        </button>
    `;
    
    return card;
}

function viewScore(scoreId) {
    showNotification(`Cargando partitura #${scoreId}...`);
    // Aquí se cargaría la partitura real
    generateSampleSheetMusic();
    elements.sheetActions.classList.remove('hidden');
    
    // Scroll a la sección de partituras
    document.querySelector('.sheet-music-section').scrollIntoView({
        behavior: 'smooth'
    });
}

// Utilidades
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#f72585' : '#4361ee'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Estilos adicionales para componentes dinámicos
const additionalStyles = `
    .score-card {
        background: white;
        padding: 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        transition: transform 0.3s;
    }
    
    .score-card:hover {
        transform: translateY(-2px);
    }
    
    .score-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 1rem;
    }
    
    .score-header h3 {
        margin: 0;
        color: var(--primary-color);
    }
    
    .user-badge {
        background: var(--accent-color);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .score-info {
        margin-bottom: 1rem;
    }
    
    .score-info p {
        margin: 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .score-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        color: #666;
    }
    
    .view-score-btn {
        width: 100%;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.75rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .view-score-btn:hover {
        background: var(--secondary-color);
    }
    
    .sheet-music-preview {
        text-align: center;
    }
    
    .staff {
        background: white;
        padding: 2rem;
        border-radius: var(--border-radius);
        margin: 1rem 0;
        font-family: monospace;
        font-size: 1.2rem;
    }
    
    .sheet-info {
        text-align: left;
        max-width: 300px;
        margin: 0 auto;
    }
    
    .sheet-info p {
        margin: 0.5rem 0;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
