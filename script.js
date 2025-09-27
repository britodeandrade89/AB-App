<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>AB Fit - Assessoria</title>

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#111827">
    <link rel="manifest" href="data:application/manifest+json,{
        &quot;name&quot;: &quot;AB Fit&quot;,
        &quot;short_name&quot;: &quot;AB Fit&quot;,
        &quot;start_url&quot;: &quot;.&quot;,
        &quot;display&quot;: &quot;standalone&quot;,
        &quot;background_color&quot;: &quot;#000000&quot;,
        &quot;theme_color&quot;: &quot;#111827&quot;,
        &quot;description&quot;: &quot;Assessoria de Treinamento Físico por André Brito.&quot;,
        &quot;icons&quot;: [
            { &quot;src&quot;: &quot;https://i.ibb.co/L06f36R/logo-ab-fit-192.png&quot;, &quot;sizes&quot;: &quot;192x192&quot;, &quot;type&quot;: &quot;image/png&quot; },
            { &quot;src&quot;: &quot;https://i.ibb.co/P9T5YQJ/logo-ab-fit-512.png&quot;, &quot;sizes&quot;: &quot;512x512&quot;, &quot;type&quot;: &quot;image/png&quot; }
        ]
    }">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="AB Fit">
    <link rel="apple-touch-icon" href="https://i.ibb.co/L06f36R/logo-ab-fit-192.png">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Feather Icons -->
    <script src="https://unpkg.com/feather-icons"></script>
    <!-- Chart.js for graphs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js"></script>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

    <style>
        body { font-family: 'Inter', sans-serif; background-color: #000; }
        .logo-text { font-weight: 800; letter-spacing: -0.05em; }
        
        .screens-wrapper { position: relative; width: 100%; height: 100%; overflow: hidden; }

        .screen {
            display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            overflow-y: auto; background-color: #000;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            -webkit-overflow-scrolling: touch;
        }
        .screen.active { display: block; }

        .screen-enter-from-right { transform: translateX(100%); }
        .screen-exit-to-left { transform: translateX(-100%); }
        .screen-enter-from-left { transform: translateX(-100%); }
        .screen-exit-to-right { transform: translateX(100%); }

        #splashScreen.fade-out { opacity: 0; transition: opacity 0.5s ease-in-out; }

        .modal { transition: opacity 0.3s ease-in-out; }
        .modal-content { transition: transform 0.3s ease-in-out; }
        .loader {
             border: 4px solid #4b5563; border-top: 4px solid #ef4444; border-radius: 50%;
             width: 32px; height: 32px; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        /* Estilos específicos do app existente */
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }
        .calendar-day:hover {
            transform: scale(1.05);
        }
        .calendar-day.treino-A {
            background-color: #3b82f6;
            color: white;
        }
        .calendar-day.treino-B {
            background-color: #10b981;
            color: white;
        }
        .calendar-day.treino-F {
            background-color: #f59e0b;
            color: white;
        }
        .calendar-day.has-treino {
            border: 2px solid;
        }
        .calendar-day.empty {
            background-color: transparent;
            cursor: default;
        }
        .calendar-day.today {
            border: 2px solid #ef4444;
        }
        .offline-indicator {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #ef4444;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            z-index: 1000;
            display: none;
        }
        
        /* Cores específicas para os treinos de corrida com fundo escuro */
        .running-title-tiros { color: #ef4444 !important; background-color: #1f2937; padding: 4px 8px; border-radius: 4px; }
        .running-title-longao { color: #60a5fa !important; background-color: #1f2937; padding: 4px 8px; border-radius: 4px; }
        .running-title-fartlek { color: #93c5fd !important; background-color: #1f2937; padding: 4px 8px; border-radius: 4px; }
        .running-title-ritmo { color: #fbbf24 !important; background-color: #1f2937; padding: 4px 8px; border-radius: 4px; }
        .running-title-intervalado { color: #fbbf24 !important; background-color: #1f2937; padding: 4px 8px; border-radius: 4px; }
        
        /* Fundo mais escuro para melhor contraste */
        .running-session-card {
            background-color: #374151 !important;
        }

        /* Estilos para o sistema de atividades outdoor */
        .outdoor-activity-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100px;
            font-size: 0.9em;
            font-weight: 600;
            color: white;
            background-color: #374151;
            border: 2px solid #4b5563;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .outdoor-activity-btn:hover {
            border-color: #3b82f6;
            background-color: #4b5563;
            transform: translateY(-2px);
        }
        .outdoor-activity-icon {
            font-size: 2em;
            margin-bottom: 8px;
            color: #60a5fa;
        }
        .map-placeholder {
            height: 250px;
            width: 100%;
            border-radius: 12px;
            border: 2px solid #374151;
            background-color: #1f2937;
        }
        .outdoor-stats-panel {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 20px;
        }
        .outdoor-stat-card {
            background-color: #374151;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
        }
        .outdoor-stat-card h2 {
            font-size: 0.8em;
            margin-bottom: 4px;
            color: #9ca3af;
            font-weight: 500;
        }
        .outdoor-stat-card p {
            font-size: 1.2em;
            font-weight: 700;
            margin: 0;
            color: white;
        }
    </style>
</head>
<body class="overscroll-none">

    <!-- ======================= SPLASH SCREEN ======================= -->
    <div id="splashScreen" class="w-full h-screen flex flex-col items-center justify-center bg-black">
        <img src="https://i.ibb.co/P9T5YQJ/logo-ab-fit-512.png" alt="Logo AB Fit" class="w-40 h-40">
    </div>

    <!-- ======================= APP CONTAINER ======================= -->
    <div id="appContainer" class="hidden h-screen flex flex-col max-w-lg mx-auto bg-black">
        <main class="flex-grow screens-wrapper">

            <!-- ======================= TELA DE LOGIN/SELEÇÃO DE USUÁRIO ======================= -->
            <div id="loginScreen" class="screen active p-6">
                <header class="text-center pt-6 pb-8">
                   <img src="https://i.ibb.co/P9T5YQJ/logo-ab-fit-512.png" alt="Logo AB Fit" class="w-24 h-24 mx-auto">
                </header>
                <h1 class="text-3xl font-extrabold text-white mb-4">AB Fit</h1>
                <div class="bg-red-600 text-white p-4 rounded-xl mb-6 shadow-lg shadow-red-500/20">
                    <div class="flex items-center mb-1">
                        <i data-feather="lock" class="w-5 h-5 mr-2"></i>
                        <h3 class="font-bold text-lg">🔐 Acesse Seu Perfil</h3>
                    </div>
                    <p class="text-sm">Selecione seu perfil para continuar</p>
                </div>
                <div id="user-selection-container" class="space-y-3"></div>
            </div>

            <!-- ======================= TELA LISTA DE ALUNOS ======================= -->
            <div id="studentListScreen" class="screen p-6">
                <header class="flex items-center justify-between pt-6 pb-4">
                    <button class="back-btn p-2 rounded-full hover:bg-gray-800" data-target="loginScreen"><i data-feather="arrow-left" class="text-gray-300"></i></button>
                     <img src="https://i.ibb.co/P9T5YQJ/logo-ab-fit-512.png" alt="Logo AB Fit" class="w-16 h-16">
                    <div class="w-10"></div>
                </header>
                 <h1 class="text-3xl font-extrabold text-white mb-4">Alunos da Assessoria</h1>
                <div class="bg-blue-600 text-white p-4 rounded-xl mb-6 shadow-lg shadow-blue-500/20">
                    <div class="flex items-center mb-1">
                         <i data-feather="users" class="w-5 h-5 mr-2"></i>
                        <h3 class="font-bold text-lg">👥 Nossa Equipe</h3>
                    </div>
                    <p class="text-sm">Conheça os alunos da assessoria</p>
                </div>
                <div id="student-list-container" class="space-y-3"></div>
            </div>

            <!-- ======================= TELA PERFIL DO ALUNO ======================= -->
            <div id="studentProfileScreen" class="screen p-6">
                 <header class="flex items-center justify-between pt-6 pb-4">
                    <button class="back-btn p-2 rounded-full hover:bg-gray-800" data-target="studentListScreen"><i data-feather="arrow-left" class="text-gray-300"></i></button>
                     <img src="https://i.ibb.co/P9T5YQJ/logo-ab-fit-512.png" alt="Logo AB Fit" class="w-16 h-16">
                    <div class="w-10"></div>
                </header>
                 <h1 class="text-3xl font-extrabold text-white mb-4 text-center">PERFIL DO ALUNO</h1>
                <div id="student-profile-info" class="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-xl mb-6"></div>
                
                <button id="openAiModalBtn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-red-500/20 mb-6">
                   <i data-feather="zap"></i><span>✨ Gerar Treino com IA</span>
                </button>
                
                <div id="student-profile-buttons" class="grid grid-cols-2 gap-4 mb-6"></div>
                
                <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div id="calendar-header" class="flex justify-between items-center mb-4">
                        <button id="prev-month-btn" class="p-2 rounded-full hover:bg-gray-700"><i data-feather="chevron-left" class="text-gray-300"></i></button>
                        <h2 id="calendar-month-year" class="font-bold text-lg text-white">Setembro 2025</h2>
                        <button id="next-month-btn" class="p-2 rounded-full hover:bg-gray-700"><i data-feather="chevron-right" class="text-gray-300"></i></button>
                    </div>
                    <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                        <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
                    </div>
                    <div id="calendar-grid" class="grid grid-cols-7 gap-1 text-center text-sm"></div>
                </div>
            </div>

            <!-- ======================= TELA DE TREINO ======================= -->
            <div id="trainingScreen" class="screen p-6">
                 <header class="flex items-center justify-between pt-6 pb-4">
                    <button class="back-btn p-2 rounded-full hover:bg-gray-800" data-target="studentProfileScreen"><i data-feather="arrow-left" class="text-gray-300"></i></button>
                    <h1 id="training-title" class="text-2xl font-bold text-white">Treino</h1>
                    <div class="w-10"></div>
                </header>
                <div id="training-content-wrapper" class="space-y-3 pb-24"></div>
            </div>

            <!-- ======================= TELA DE EVOLUÇÃO ======================= -->
            <div id="evolutionScreen" class="screen p-6">
                 <header class="flex items-center justify-between pt-6 pb-4">
                    <button class="back-btn p-2 rounded-full hover:bg-gray-800" data-target="studentProfileScreen"><i data-feather="arrow-left" class="text-gray-300"></i></button>
                    <h1 class="text-2xl font-bold text-white">Evolução de Carga</h1>
                    <div class="w-10"></div>
                </header>
                <div class="space-y-4 pb-24">
                    <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h2 class="text-xl font-bold text-white mb-4">Treino A</h2>
                        <canvas id="treinoAChart" class="w-full"></canvas>
                    </div>
                    <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h2 class="text-xl font-bold text-white mb-4">Treino B</h2>
                        <canvas id="treinoBChart" class="w-full"></canvas>
                    </div>
                </div>
            </div>

            <!-- ======================= TELA CONTROLE DE PESO ======================= -->
            <div id="weightControlScreen" class="screen p-6">
                 <header class="flex items-center justify-between pt-6 pb-4">
                    <button class="back-btn p-2 rounded-full hover:bg-gray-800" data-target="studentProfileScreen"><i data-feather="arrow-left" class="text-gray-300"></i></button>
                    <h1 class="text-2xl font-bold text-white">Controle de Peso</h1>
                    <div class="w-10"></div>
                </header>
                <div class="space-y-4 pb-24">
                    <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h2 class="text-xl font-bold text-white mb-4">Adicionar Novo Registro</h2>
                        <div class="flex items-center gap-2">
                            <input type="number" step="0.1" id="weight-input" placeholder="Ex: 85.5" class="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg">
                            <span class="font-semibold text-gray-300">kg</span>
                            <button id="save-weight-btn" class="bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors">Salvar</button>
                        </div>
                    </div>
                    <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h2 class="text-xl font-bold text-white mb-4">Evolução do Peso</h2>
                        <canvas id="weightChart" class="w-full"></canvas>
                    </div>
                     <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h2 class="text-xl font-bold text-white mb-4">Histórico de Peso</h2>
                        <div id="weight-history-list" class="space-y-2"></div>
                    </div>
                </div>
            </div>

            <!-- ======================= TELA ATIVIDADES OUTDOOR ======================= -->
            <div id="outdoorScreen" class="screen p-6">
                 <header class="flex items-center justify-between pt-6 pb-4">
                    <button class="back-btn p-2 rounded-full hover:bg-gray-800" data-target="studentProfileScreen"><i data-feather="arrow-left" class="text-gray-300"></i></button>
                    <h1 class="text-2xl font-bold text-white">AB Fit Outdoor</h1>
                    <div class="w-10"></div>
                </header>
                <div class="space-y-4 pb-24">
                    <div class="bg-gray-800 p-4 rounded-xl border border-gray-700">
                        <h2 class="text-xl font-bold text-white mb-4 text-center">Escolha sua Atividade</h2>
                        <div class="grid grid-cols-2 gap-4">
                            <button class="outdoor-activity-btn" data-activity="Caminhada outdoor">
                                <i class="fas fa-walking outdoor-activity-icon"></i>
                                <span>Caminhada</span>
                            </button>
                            <button class="outdoor-activity-btn" data-activity="Corrida outdoor">
                                <i class="fas fa-running outdoor-activity-icon"></i>
                                <span>Corrida</span>
                            </button>
                            <button class="outdoor-activity-btn" data-activity="Ciclismo Outdoor">
                                <i class="fas fa-biking outdoor-activity-icon"></i>
                                <span>Ciclismo</span>
                            </button>
                            <button class="outdoor-activity-btn" data-activity="Remo Outdoor">
                                <i class="fas fa-ship outdoor-activity-icon"></i>
                                <span>Remo</span>
                            </button>
                        </div>
                    </div>

                    <!-- Tela do Rastreador -->
                    <div id="outdoorTracker" class="hidden">
                        <div id="outdoorMap" class="map-placeholder mb-4"></div>
                        
                        <div class="outdoor-stats-panel">
                            <div class="outdoor-stat-card">
                                <h2>Tempo</h2>
                                <p id="outdoorTime">00:00:00</p>
                            </div>
                            <div class="outdoor-stat-card">
                                <h2>Distância</h2>
                                <p id="outdoorDistance">0.00 km</p>
                            </div>
                            <div class="outdoor-stat-card">
                                <h2>Ritmo Atual</h2>
                                <p id="outdoorPace">--:-- /km</p>
                            </div>
                            <div class="outdoor-stat-card">
                                <h2>Velocidade</h2>
                                <p id="outdoorSpeed">0.0 km/h</p>
                            </div>
                        </div>

                        <div class="flex space-x-4 mt-6">
                            <button id="outdoorStartButton" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">
                                <i class="fas fa-play mr-2"></i> Iniciar
                            </button>
                            <button id="outdoorStopButton" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg" disabled>
                                <i class="fas fa-stop mr-2"></i> Finalizar
                            </button>
                        </div>
                    </div>

                    <!-- Histórico de Treinos Outdoor -->
                    <div id="outdoorHistory" class="bg-gray-800 p-4 rounded-xl border border-gray-700 mt-6">
                        <h2 class="text-xl font-bold text-white mb-4">Histórico de Treinos Outdoor</h2>
                        <div id="outdoorHistoryList" class="space-y-3">
                            <!-- Lista será preenchida pelo JavaScript -->
                        </div>
                    </div>
                </div>
            </div>

        </main>

        <!-- ======================= BOTTOM NAVIGATION ======================= -->
        <footer id="bottom-nav" class="flex-shrink-0 bg-gray-800 border-t border-gray-700">
            <div class="flex justify-around items-center h-20">
                <button class="nav-btn text-red-500 flex flex-col items-center space-y-1" data-target="studentListScreen"><i data-feather="trello"></i><span class="text-xs font-semibold">TREINOS</span></button>
                <button class="nav-btn text-gray-400 hover:text-white flex flex-col items-center space-y-1" data-target="evolutionScreen"><i data-feather="trending-up"></i><span class="text-xs font-semibold">PROGRESSO</span></button>
                <button class="nav-btn text-gray-400 hover:text-white flex flex-col items-center space-y-1" data-target="studentProfileScreen"><i data-feather="user"></i><span class="text-xs font-semibold">PERFIL</span></button>
            </div>
        </footer>
    </div>
    
    <!-- ======================= MODAIS ======================= -->
    <div class="offline-indicator" id="offlineIndicator">🔴 OFFLINE</div>
    
    <div id="exerciseDetailModal" class="modal fixed inset-0 bg-black bg-opacity-70 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-md p-6 relative" id="exercise-modal-content">
            <button id="closeExerciseModalBtn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-200"><i data-feather="x"></i></button>
            <div id="exercise-modal-body"></div>
        </div>
    </div>

    <div id="runningLogModal" class="modal fixed inset-0 bg-black bg-opacity-70 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-md p-6 relative" id="running-modal-content">
            <button id="closeRunningLogModalBtn" class="absolute top-4 right-4 text-gray-400 hover:text-gray-200"><i data-feather="x"></i></button>
            <div id="running-log-modal-body"></div>
        </div>
    </div>

    <!-- Modal de Resumo Outdoor -->
    <div id="outdoorSummaryModal" class="modal fixed inset-0 bg-black bg-opacity-70 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-gray-800 text-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <h2 class="text-2xl font-bold mb-4">Treino Finalizado!</h2>
            <div id="outdoorSummaryStats" class="space-y-2 mb-4">
                <!-- Estatísticas serão preenchidas aqui -->
            </div>
            <div class="flex space-x-4">
                <button id="outdoorSaveButton" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg">
                    <i class="fas fa-save mr-2"></i> Salvar
                </button>
                <button id="outdoorDiscardButton" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg">
                    <i class="fas fa-trash mr-2"></i> Descartar
                </button>
            </div>
        </div>
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script type="module">
    // --- GEMINI API CONFIG ---
    const apiKey = "sua-chave-gemini-aqui";

    // --- DATABASE ---
    const database = {
        users: [
            { id: 1, name: 'André Brito', email: 'britodeandrade@gmail.com', photo: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/WsTwhcQeE99iAkUHmCmn/pub/3Zy4n6ZmWp9DW98VtXpO.jpeg' },
            { id: 2, name: 'Marcelly Bispo', email: 'marcellybispo92@gmail.com', photo: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/WsTwhcQeE99iAkUHmCmn/pub/2VWhNV4eSyDNkwEzPGvq.jpeg' },
            { id: 3, name: 'Marcia Brito', email: 'andrademarcia.ucam@gmail.com', photo: 'https://storage.googleapis.com/glide-prod.appspot.com/uploads-v2/WsTwhcQeE99iAkUHmCmn/pub/huS3I3wDTHbXGY1EuLjf.jpg' },
            { id: 4, name: 'Liliane Torres', email: 'lilicatorres@gmail.com', photo: 'https://i.ibb.co/7j6x0gG/liliane-torres.jpg' }
        ],
        trainingPlans: {},
        userRunningWorkouts: {
            'britodeandrade@gmail.com': [
                { 
                    method: 'FARTLEK', 
                    details: "5' AQ + 20' CO alternado entre CA : CO + 5' REC", 
                    speed: '8,5 Km/h', 
                    pace: '7:00/Km',
                    time: '30 min',
                    fcAlvo: '80%',
                    fcMax: '184 BPM',
                    fcTreino: '147,2 BPM'
                },
                { 
                    method: 'INTERVALADO', 
                    details: "5' AQ + (6 BLOCOS) 2' CO : 1'30'' REC + 3' REC", 
                    speed: '9,5 Km/h', 
                    pace: '6:19/Km',
                    time: '30 min',
                    fcAlvo: '85%',
                    fcMax: '184 BPM',
                    fcTreino: '156,4 BPM'
                },
                { 
                    method: 'LONGÃO', 
                    details: "5' AQ + 3 KM DE CO CONTÍNUA + 5' REC", 
                    speed: '8,5 Km/h', 
                    pace: '7:04/Km',
                    time: '30 min',
                    fcAlvo: '80%',
                    fcMax: '184 BPM',
                    fcTreino: '147,2 BPM'
                },
                { 
                    method: 'RITMO', 
                    details: "5' AQ + (4 BLOCOS) 500 metros CO : 2'30'' REC + 3' REC", 
                    speed: '11 Km/h', 
                    pace: '5:27/Km',
                    time: '26,3 min',
                    fcAlvo: '90%',
                    fcMax: '184 BPM',
                    fcTreino: '165,6 BPM'
                },
                { 
                    method: 'TIROS', 
                    details: "5' AQ + (8 TIROS) 200 metros CO : 2'30 REC + 3' REC", 
                    speed: '15 Km/h', 
                    pace: '4:00/Km',
                    time: '32 min',
                    fcAlvo: '95%',
                    fcMax: '184 BPM',
                    fcTreino: '174,8 BPM'
                }
            ],
            'marcellybispo92@gmail.com': [
                { 
                    method: 'FARTLEK', 
                    details: "5' AQ + 20' CO alternado entre CA : CO + 5' REC", 
                    speed: '7,5 Km/h', 
                    pace: '8:00/Km',
                    time: '30 min',
                    fcAlvo: '80%',
                    fcMax: '187 BPM',
                    fcTreino: '149,6 BPM'
                },
                { 
                    method: 'INTERVALADO', 
                    details: "5' AQ + (6 BLOCOS) 2' CO : 1'30'' REC + 3' REC", 
                    speed: '8,5 Km/h', 
                    pace: '7:04/Km',
                    time: '30 min',
                    fcAlvo: '85%',
                    fcMax: '187 BPM',
                    fcTreino: '158,95 BPM'
                },
                { 
                    method: 'LONGÃO', 
                    details: "5' AQ + 3 KM DE CO CONTÍNUA + 5' REC", 
                    speed: '8 Km/h', 
                    pace: '7:30/Km',
                    time: '30 min',
                    fcAlvo: '80%',
                    fcMax: '187 BPM',
                    fcTreino: '149,6 BPM'
                },
                { 
                    method: 'RITMO', 
                    details: "5' AQ + (4 BLOCOS) 500 metros CO : 2'30'' REC + 3' REC", 
                    speed: '9,5 Km/h', 
                    pace: '6:19/Km',
                    time: '26,3 min',
                    fcAlvo: '90%',
                    fcMax: '187 BPM',
                    fcTreino: '168,3 BPM'
                },
                { 
                    method: 'TIROS', 
                    details: "5' AQ + (8 TIROS) 200 metros CO : 2'30 REC + 3' REC", 
                    speed: '12 Km/h', 
                    pace: '5:00/Km',
                    time: '32 min',
                    fcAlvo: '95%',
                    fcMax: '187 BPM',
                    fcTreino: '177,65 BPM'
                }
            ],
            'lilicatorres@gmail.com': [
                { 
                    method: 'FARTLEK', 
                    details: "5' CA Fraca + 25' CA Forte : CA Fraca", 
                    speed: '5,5 Km/h', 
                    pace: '11:00/Km',
                    time: '30 min',
                    fcAlvo: 'N/A',
                    fcMax: '186 BPM',
                    fcTreino: 'N/A'
                },
                { 
                    method: 'INTERVALADO', 
                    details: "5' AQ + (6 BLOCOS) 2' CO : 1'30'' REC + 3' REC", 
                    speed: '8,5 Km/h', 
                    pace: '7:04/Km',
                    time: '30 min',
                    fcAlvo: '85%',
                    fcMax: '187 BPM',
                    fcTreino: '158,95 BPM'
                },
                { 
                    method: 'LONGÃO', 
                    details: "5' CA Fraca + 2 KM DE CA CONTÍNUA + 5' CA Fraca", 
                    speed: '5,5 Km/h', 
                    pace: '11:00/Km',
                    time: '30 min',
                    fcAlvo: 'N/A',
                    fcMax: '186 BPM',
                    fcTreino: 'N/A'
                },
                { 
                    method: 'RITMO', 
                    details: "5' CA Fraca + (4 BLOCOS) 500 metros CA Forte : 2'30'' CA Fraca + 3' Ca Fraca", 
                    speed: '6 Km/h', 
                    pace: '10:00/Km',
                    time: '30 min',
                    fcAlvo: 'N/A',
                    fcMax: '186 BPM',
                    fcTreino: 'N/A'
                },
                { 
                    method: 'TIROS', 
                    details: "5' CA Fraca + (9 TIROS) 1' CO Confortavel : 2' CA Fraca + 3' REC", 
                    speed: '7,5 Km/h', 
                    pace: '8:00/Km',
                    time: '30 min',
                    fcAlvo: 'N/A',
                    fcMax: '186 BPM',
                    fcTreino: 'N/A'
                }
            ],
            'andrademarcia.ucam@gmail.com': [
                { 
                    method: 'FARTLEK', 
                    details: "5' CA Fraca + 25' CA Forte : CA Fraca", 
                    speed: '5,5 Km/h', 
                    pace: '11:00/Km',
                    time: '30 min',
                    fcAlvo: 'N/A',
                    fcMax: '161 BPM',
                    fcTreino: 'N/A'
                },
                { 
                    method: 'INTERVALADO', 
                    details: "5' AQ + (6 BLOCOS) 2' CO : 1'30'' REC + 3' REC", 
                    speed: '5,5 Km/h', 
                    pace: '11:00/Km',
                    time: '30 min',
                    fcAlvo: 'N
