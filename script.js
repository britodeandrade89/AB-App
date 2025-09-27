// --- SISTEMA DE ARMAZENAMENTO ---
const STORAGE_KEYS = {
    DATABASE: 'abfit_database',
    CURRENT_USER: 'abfit_current_user'
};

// MODIFICADO: Carrega o banco de dados do JSON se não estiver no localStorage
async function initializeDatabase() {
    const savedDB = localStorage.getItem(STORAGE_KEYS.DATABASE);
    if (!savedDB) {
        try {
            const response = await fetch('database.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const initialDatabase = await response.json();
            localStorage.setItem(STORAGE_KEYS.DATABASE, JSON.stringify(initialDatabase));
            console.log('Banco de dados inicializado a partir do JSON.');
        } catch (error) {
            console.error('Falha ao carregar o banco de dados inicial:', error);
            // Opcional: carregar um objeto de fallback em caso de erro
        }
    }
}

function getDatabase() {
    const saved = localStorage.getItem(STORAGE_KEYS.DATABASE);
    // Retorna um objeto vazio se nada for encontrado para evitar erros
    return saved ? JSON.parse(saved) : { users: [], trainingPlans: {}, userRunningWorkouts: {} };
}

function saveDatabase(db) {
    localStorage.setItem(STORAGE_KEYS.DATABASE, JSON.stringify(db));
}

// --- STATE & NAVIGATION ---
let currentStudentId = null;
let currentStudentEmail = null;
let isTransitioning = false;
let currentTrainingType = null;
let currentCalendarDate = new Date();

function showScreen(targetId, direction = 'forward') {
    if (isTransitioning && direction !== 'none') return;
    isTransitioning = true;

    const currentScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(targetId);
    if (!targetScreen) { isTransitioning = false; return; }

    document.querySelectorAll('.screen').forEach(s => s.style.zIndex = '1');
    targetScreen.style.zIndex = '10';

    if (currentScreen && direction === 'none') {
        currentScreen.classList.remove('active');
        targetScreen.classList.add('active');
        isTransitioning = false;
        return;
    }

    if (currentScreen) {
        currentScreen.classList.add(direction === 'forward' ? 'screen-exit-to-left' : 'screen-exit-to-right');
    }

    targetScreen.style.display = 'flex';
    const enterClass = direction === 'forward' ? 'screen-enter-from-right' : 'screen-enter-from-left';
    targetScreen.classList.add(enterClass);
    targetScreen.offsetHeight;
    targetScreen.classList.remove(enterClass);
    targetScreen.classList.add('active');

    if (currentScreen) currentScreen.classList.remove('active');

    setTimeout(() => {
        if (currentScreen) {
            currentScreen.style.display = 'none';
            currentScreen.classList.remove('screen-exit-to-left', 'screen-exit-to-right');
        }
        isTransitioning = false;
    }, 500);
}

// --- FUNÇÕES DE RENDERIZAÇÃO ---
function populateUserSelection() {
    const db = getDatabase();
    const container = document.getElementById('user-selection-container');
    container.innerHTML = db.users.map(user => `
        <div class="user-card flex items-center p-3 bg-gray-800 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition" data-user-email="${user.email}">
            <img src="${user.photo}" alt="${user.name}" class="w-12 h-12 rounded-full object-cover mr-4">
            <div class="flex-grow">
                <p class="font-semibold text-white">${user.name}</p>
                <span class="text-sm text-gray-400">Acessar meu perfil</span>
            </div>
            <i data-feather="log-in" class="text-red-500"></i>
        </div>
    `).join('');
    feather.replace();
}

function populateStudentList() {
    const db = getDatabase();
    const container = document.getElementById('student-list-container');
    container.innerHTML = db.users.map(student => `
        <div class="student-card flex items-center p-3 bg-gray-800 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-700 transition" data-student-id="${student.id}">
            <img src="${student.photo}" alt="${student.name}" class="w-12 h-12 rounded-full object-cover mr-4">
            <div class="flex-grow">
                <p class="font-semibold text-white">${student.name}</p>
                <span class="text-sm text-gray-400">Ver perfil completo</span>
            </div>
            <i data-feather="user" class="text-blue-500"></i>
        </div>
    `).join('');
    feather.replace();
}

function populateStudentProfile(studentId) {
    currentStudentId = studentId;
    const db = getDatabase();
    const student = db.users.find(s => s.id == studentId);
    if (!student) return;

    currentStudentEmail = student.email;

    const infoContainer = document.getElementById('student-profile-info');
    infoContainer.innerHTML = `
        <img src="${student.photo}" alt="${student.name}" class="w-14 h-14 rounded-full object-cover mr-4">
        <div>
            <h2 class="text-xl font-bold text-white">${student.name}</h2>
            <p class="text-gray-400 text-sm">${student.email}</p>
        </div>
    `;

    const buttonsContainer = document.getElementById('student-profile-buttons');
    buttonsContainer.innerHTML = `
        <button class="profile-action-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition shadow-lg" data-action="A">
            <i data-feather="star"></i><span class="text-xs">TREINO A</span>
        </button>
        <button class="profile-action-btn bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition shadow-lg" data-action="B">
            <i data-feather="zap"></i><span class="text-xs">TREINO B</span>
        </button>
        <button class="profile-action-btn bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition shadow-lg" data-action="corrida">
            <i data-feather="trending-up"></i><span class="text-xs">CORRIDA</span>
        </button>
        <button class="profile-action-btn bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition shadow-lg" data-action="periodizacao">
            <i data-feather="calendar"></i><span class="text-xs">PERIODIZAÇÃO</span>
        </button>
        <button class="profile-action-btn bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition shadow-lg" data-action="evolution">
            <i data-feather="bar-chart-2"></i><span class="text-xs">PROGRESSO</span>
        </button>
        <button class="profile-action-btn bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl flex flex-col items-center justify-center space-y-2 transition shadow-lg" data-action="weight">
            <i data-feather="activity"></i><span class="text-xs">CONTROLE PESO</span>
        </button>
    `;

    feather.replace();
    renderCalendar();
}

// --- SISTEMA DE TREINOS ---
function loadTrainingScreen(trainingType) {
    currentTrainingType = trainingType;
    const db = getDatabase();
    const trainingPlan = db.trainingPlans[currentStudentEmail]?.[trainingType] || [];

    const title = document.getElementById('training-title');
    const content = document.getElementById('training-content-wrapper');

    title.textContent = `Treino ${trainingType}`;
    content.innerHTML = '';

    if (trainingPlan.length === 0) {
        content.innerHTML = `
            <div class="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                <i data-feather="frown" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <h3 class="text-xl font-bold text-white mb-2">Nenhum treino cadastrado</h3>
                <p class="text-gray-400">Entre em contato com o professor para definir seu treino.</p>
            </div>
        `;
        feather.replace();
        return;
    }

    trainingPlan.forEach((exercise) => {
        const exerciseCard = document.createElement('div');
        exerciseCard.className = 'bg-gray-800 p-4 rounded-xl border border-gray-700';
        exerciseCard.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center flex-1">
                    <img src="${exercise.img}" alt="${exercise.name}" class="w-16 h-16 rounded-lg object-cover mr-4">
                    <div class="flex-1">
                        <h3 class="font-bold text-white text-lg">${exercise.name}</h3>
                        <p class="text-gray-300 text-sm">${exercise.series}</p>
                        <div class="flex items-center mt-2">
                            <input type="number" value="${exercise.carga || ''}" class="carga-input w-20 bg-gray-700 text-white border border-gray-600 rounded-lg py-1 px-2 mr-2" placeholder="Carga" data-exercise-id="${exercise.id}">
                            <span class="text-gray-300 text-sm">kg</span>
                            <button class="save-carga-btn ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded-lg transition-colors" data-exercise-id="${exercise.id}">Salvar</button>
                        </div>
                    </div>
                </div>
                <button class="checkin-btn bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors ml-4" data-exercise-id="${exercise.id}"><i data-feather="check"></i></button>
            </div>
        `;
        content.appendChild(exerciseCard);
    });

    feather.replace();
}

function saveExerciseLoad(exerciseId, newCarga) {
    const db = getDatabase();
    const exercise = db.trainingPlans[currentStudentEmail]?.[currentTrainingType]?.find(ex => ex.id == exerciseId);

    if (exercise) {
        exercise.carga = newCarga;
        if (!exercise.history) exercise.history = [];
        exercise.history.push({
            carga: newCarga,
            date: new Date().toISOString().split('T')[0]
        });
        saveDatabase(db);
        alert('Carga salva com sucesso!');
    }
}

function markExerciseAsCompleted(exerciseId) {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];

    if (!db.trainingPlans[currentStudentEmail].attendance) {
        db.trainingPlans[currentStudentEmail].attendance = {};
    }

    if (!db.trainingPlans[currentStudentEmail].attendance[today]) {
        db.trainingPlans[currentStudentEmail].attendance[today] = {
            type: currentTrainingType,
            exercises: []
        };
    }

    if (!db.trainingPlans[currentStudentEmail].attendance[today].exercises.includes(exerciseId)) {
        db.trainingPlans[currentStudentEmail].attendance[today].exercises.push(exerciseId);
    }
    saveDatabase(db);

    alert('Exercício marcado como realizado!');
    renderCalendar();
}

// --- SISTEMA DE CORRIDA ---
function loadRunningScreen() {
    const db = getDatabase();
    const runningWorkouts = db.userRunningWorkouts[currentStudentEmail] || [];

    const title = document.getElementById('training-title');
    const content = document.getElementById('training-content-wrapper');

    title.textContent = 'Treino de Corrida';
    content.innerHTML = '';

    if (runningWorkouts.length === 0) {
        content.innerHTML = `<div class="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center"><i data-feather="frown" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i><h3 class="text-xl font-bold text-white mb-2">Nenhum treino de corrida cadastrado</h3><p class="text-gray-400">Entre em contato com o professor.</p></div>`;
        feather.replace();
        return;
    }

    runningWorkouts.forEach((workout, index) => {
        const methodClass = `running-title-${workout.method.toLowerCase()}`;
        const card = document.createElement('div');
        card.className = 'running-session-card bg-gray-800 p-4 rounded-xl border border-gray-700';
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="${methodClass} font-bold text-lg">${workout.method}</h3>
                <button class="checkin-running-btn bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-3 rounded-lg transition-colors flex items-center gap-1" data-workout-index="${index}"><i data-feather="check" class="w-4 h-4"></i> Realizado</button>
            </div>
            <p class="text-white mb-2"><strong>Detalhes:</strong> ${workout.details}</p>
            <div class="grid grid-cols-2 gap-2 text-sm mt-4">
                <div><span class="text-gray-400">Velocidade:</span> <span class="text-white">${workout.speed}</span></div>
                <div><span class="text-gray-400">Pace:</span> <span class="text-white">${workout.pace}</span></div>
                <div><span class="text-gray-400">Tempo:</span> <span class="text-white">${workout.time}</span></div>
                <div><span class="text-gray-400">FC Alvo:</span> <span class="text-white">${workout.fcAlvo}</span></div>
            </div>
        `;
        content.appendChild(card);
    });

    feather.replace();
}

function markRunningAsCompleted(workoutIndex) {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];

    if (!db.trainingPlans[currentStudentEmail].attendance) {
        db.trainingPlans[currentStudentEmail].attendance = {};
    }

    if (!db.trainingPlans[currentStudentEmail].attendance[today]) {
        db.trainingPlans[currentStudentEmail].attendance[today] = {
            type: 'running',
            workouts: []
        };
    }

    if (!db.trainingPlans[currentStudentEmail].attendance[today].workouts.includes(workoutIndex)) {
        db.trainingPlans[currentStudentEmail].attendance[today].workouts.push(workoutIndex);
    }
    saveDatabase(db);

    alert('Treino de corrida marcado como realizado!');
    renderCalendar();
}

// --- SISTEMA DE PERIODIZAÇÃO ---
function loadPeriodizationScreen() {
    const db = getDatabase();
    const periodization = db.trainingPlans[currentStudentEmail]?.periodizacao || [];

    const title = document.getElementById('training-title');
    const content = document.getElementById('training-content-wrapper');

    title.textContent = 'Periodização';
    content.innerHTML = '';

    if (periodization.length === 0) {
        content.innerHTML = `<div class="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center"><i data-feather="frown" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i><h3 class="text-xl font-bold text-white mb-2">Periodização não definida</h3><p class="text-gray-400">Entre em contato com o professor.</p></div>`;
        feather.replace();
        return;
    }

    periodization.forEach((phase) => {
        const phaseCard = document.createElement('div');
        phaseCard.className = 'bg-gray-800 p-4 rounded-xl border border-gray-700 mb-4';
        phaseCard.innerHTML = `
            <h3 class="font-bold text-white text-lg mb-3">${phase.week} - ${phase.phase}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div><span class="text-gray-400">Método:</span> <span class="text-white">${phase.methods}</span></div>
                <div><span class="text-gray-400">Repetições:</span> <span class="text-white">${phase.reps}</span></div>
                <div><span class="text-gray-400">Volume:</span> <span class="text-white">${phase.volume}</span></div>
                <div><span class="text-gray-400">Intensidade:</span> <span class="text-white">${phase.intensity}</span></div>
                <div><span class="text-gray-400">Recuperação:</span> <span class="text-white">${phase.recovery}</span></div>
            </div>
        `;
        content.appendChild(phaseCard);
    });
}

// --- SISTEMA DE CALENDÁRIO ---
function renderCalendar() {
    const db = getDatabase();
    const attendance = db.trainingPlans[currentStudentEmail]?.attendance || {};

    const monthYear = document.getElementById('calendar-month-year');
    const grid = document.getElementById('calendar-grid');

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    monthYear.textContent = currentCalendarDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    grid.innerHTML = '';

    for (let i = 0; i < startingDay; i++) {
        grid.insertAdjacentHTML('beforeend', '<div class="calendar-day empty"></div>');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayAttendance = attendance[dateStr];
        const isToday = date.getTime() === today.getTime();

        let classes = 'calendar-day cursor-pointer';
        if (isToday) classes += ' today';
        if (dayAttendance) {
            const type = dayAttendance.type === 'running' ? 'F' : dayAttendance.type;
            classes += ` has-treino treino-${type}`;
        }

        const dayElement = document.createElement('div');
        dayElement.className = classes;
        dayElement.textContent = day;
        dayElement.title = dayAttendance ? `Treino ${dayAttendance.type.toUpperCase()} realizado` : 'Sem treino';

        if (dayAttendance) {
            dayElement.addEventListener('click', () => showAttendanceDetails(dateStr, dayAttendance));
        }
        grid.appendChild(dayElement);
    }
}

function showAttendanceDetails(dateStr, attendance) {
    const formattedDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    alert(`Treino realizado em ${formattedDate}\nTipo: ${attendance.type.toUpperCase()}`);
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
    document.body.addEventListener('click', (e) => {
        const db = getDatabase();

        // User selection
        const userCard = e.target.closest('.user-card');
        if (userCard) {
            const userEmail = userCard.dataset.userEmail;
            const user = db.users.find(u => u.email === userEmail);
            if (user) {
                populateStudentProfile(user.id);
                showScreen('homeScreen', 'none'); // Set home as background
                showScreen('studentProfileScreen', 'forward');
            }
            return;
        }

        // Student selection
        const studentCard = e.target.closest('.student-card');
        if (studentCard) {
            populateStudentProfile(studentCard.dataset.studentId);
            showScreen('studentProfileScreen', 'forward');
            return;
        }

        // Back button
        const backBtn = e.target.closest('.back-btn');
        if (backBtn) {
            showScreen(backBtn.dataset.target, 'back');
            return;
        }

        // Nav bar
        const navBtn = e.target.closest('.nav-btn');
        if (navBtn) {
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.replace('text-red-500', 'text-gray-400'));
            navBtn.classList.replace('text-gray-400', 'text-red-500');
            if (navBtn.dataset.target) showScreen(navBtn.dataset.target, 'none');
            return;
        }

        // Profile action buttons
        const actionBtn = e.target.closest('.profile-action-btn');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            const actions = {
                'A': () => loadTrainingScreen('A'),
                'B': () => loadTrainingScreen('B'),
                'corrida': loadRunningScreen,
                'periodizacao': loadPeriodizationScreen,
            };
            if (actions[action]) {
                actions[action]();
                showScreen('trainingScreen', 'forward');
            } else {
                 const targetScreen = {
                    'evolution': 'evolutionScreen',
                    'weight': 'weightControlScreen'
                }[action];
                if (targetScreen) showScreen(targetScreen, 'forward');
            }
            return;
        }

        // Calendar navigation
        if (e.target.closest('#prev-month-btn')) {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
            return;
        }
        if (e.target.closest('#next-month-btn')) {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
            return;
        }

        // Save load button
        const saveBtn = e.target.closest('.save-carga-btn');
        if(saveBtn) {
            const exerciseId = saveBtn.dataset.exerciseId;
            const input = document.querySelector(`.carga-input[data-exercise-id="${exerciseId}"]`);
            if(input.value) saveExerciseLoad(exerciseId, parseFloat(input.value));
            return;
        }

        // Mark exercise as completed
        const checkinBtn = e.target.closest('.checkin-btn');
        if(checkinBtn) {
            markExerciseAsCompleted(checkinBtn.dataset.exerciseId);
            return;
        }
        
        // Mark running as completed
        const checkinRunningBtn = e.target.closest('.checkin-running-btn');
        if(checkinRunningBtn) {
            markRunningAsCompleted(checkinRunningBtn.dataset.workoutIndex);
            return;
        }
    });
}


// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    feather.replace();
    await initializeDatabase(); // Garante que o DB esteja pronto

    const splash = document.getElementById('splashScreen');
    const app = document.getElementById('appContainer');

    setTimeout(() => {
        splash.classList.add('fade-out');
        splash.addEventListener('transitionend', () => {
            splash.style.display = 'none';
            app.style.display = 'flex';
            app.classList.remove('hidden');
            
            // Renderiza o conteúdo inicial
            populateUserSelection();
            populateStudentList();
            setupEventListeners();
            
            showScreen('loginScreen', 'none');
        }, { once: true });
    }, 1500);
});
