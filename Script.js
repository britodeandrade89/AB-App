// Aguarda o carregamento completo da página antes de executar o código
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DA PÁGINA ---
    const userListContainer = document.getElementById('user-list-container');
    const profileContainer = document.getElementById('profile-container');
    const profileContent = document.getElementById('profile-content');
    const mainTitle = document.getElementById('main-title');
    const backButton = document.getElementById('back-button');

    // --- BANCO DE DADOS (SIMULADO COM CSV) ---
    let users = [];
    let treinoA = [];
    let treinoB = [];
    // Adicione outras variáveis para os demais CSVs

    // Função principal que inicia o aplicativo
    async function init() {
        // Carrega todos os dados dos arquivos CSV
        // A função fetch() busca o arquivo, e Papa.parse() o transforma em dados que o JS entende
        const usersResponse = await fetch('Users.csv');
        const usersText = await usersResponse.text();
        users = Papa.parse(usersText, { header: true }).data;

        const treinoAResponse = await fetch('Treino A - Geral.csv');
        const treinoAText = await treinoAResponse.text();
        treinoA = Papa.parse(treinoAText, { header: true }).data;

        // (Faça o mesmo para 'Treino B', 'Corridas', etc.)
        
        // Exibe a lista de usuários na tela inicial
        displayUserList();
    }

    // Função para mostrar a lista de usuários
    function displayUserList() {
        userListContainer.innerHTML = ''; // Limpa a lista antes de recriar
        profileContainer.classList.add('hidden');
        userListContainer.classList.remove('hidden');
        mainTitle.innerText = 'Meus Alunos';

        users.forEach(user => {
            if (user.Nome) { // Garante que não criamos cards para linhas vazias no CSV
                const userCard = document.createElement('div');
                userCard.className = 'user-card';
                userCard.innerText = user.Nome; // 'Nome' deve ser o nome da coluna no seu Users.csv
                userCard.addEventListener('click', () => showUserProfile(user));
                userListContainer.appendChild(userCard);
            }
        });
    }

    // Função para mostrar o perfil de um usuário específico
    function showUserProfile(user) {
        userListContainer.classList.add('hidden');
        profileContainer.classList.remove('hidden');
        mainTitle.innerText = `Perfil: ${user.Nome}`;
        
        // Limpa o conteúdo anterior e constrói o novo perfil
        profileContent.innerHTML = `
            <h2>Treino A</h2>
            <div id="treino-a-list"></div>
            
            <h2>Calendário</h2>
            <div id="calendar" class="calendar">
                </div>
        `;
        
        // Exibe os exercícios do Treino A
        const treinoAList = document.getElementById('treino-a-list');
        treinoA.forEach(exercicio => {
            const item = document.createElement('div');
            item.className = 'exercise-item';
            item.innerHTML = `
                <span>${exercicio['Nome do Exercício']}</span> 
                <input type="checkbox" id="${exercicio.ID}">
            `; // Use os nomes corretos das colunas do seu CSV
            treinoAList.appendChild(item);
        });

        // AQUI ENTRARIA A LÓGICA COMPLEXA PARA:
        // 1. Gerar o calendário visualmente.
        // 2. Ler os 'checks' e salvar o progresso (usando localStorage do navegador).
        // 3. Pintar o calendário com as cores corretas (amarelo, verde, vermelho).
        // 4. Mostrar as outras seções (Treino B, Corrida, Periodização).
    }

    // Evento do botão "Voltar"
    backButton.addEventListener('click', displayUserList);

    // Inicia o aplicativo
    init();
});
