// Função para carregar CSV e transformar em array
async function carregarCSV(arquivo) {
  const resposta = await fetch(arquivo);
  const texto = await resposta.text();
  const linhas = texto.trim().split("\n").map(l => l.split(","));
  return linhas.slice(1); // ignora cabeçalho
}

// Monta os cards dos alunos
async function montarAlunos() {
  const container = document.getElementById("alunos-container");
  container.innerHTML = "";

  try {
    const alunos = await carregarCSV("Usuários.csv");

    alunos.forEach(aluno => {
      const [nome, foto] = aluno; // CSV: Nome, Foto
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${foto || 'https://via.placeholder.com/80'}" alt="${nome}">
        <h3>${nome}</h3>
        <button onclick="abrirPerfil('${nome}')">Ver Perfil</button>
      `;

      container.appendChild(card);
    });

  } catch (erro) {
    container.innerHTML = "<p>Erro ao carregar alunos.</p>";
    console.error(erro);
  }
}

// Perfil (aqui ainda é simulação)
function abrirPerfil(nome) {
  // Redireciona para perfil.html passando o nome do aluno na URL
  window.location.href = `perfil.html?aluno=${encodeURIComponent(nome)}`;
}

