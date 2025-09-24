document.addEventListener("DOMContentLoaded", () => {
  const alunos = ["André", "Marcelly", "Liliane", "Marcia"];
  const lista = document.getElementById("lista-alunos");

  alunos.forEach(nome => {
    const li = document.createElement("li");
    li.innerHTML = `${nome} <button onclick="abrirPerfil('${nome}')">Ver Perfil</button>`;
    lista.appendChild(li);
  });
});

function abrirPerfil(nome) {
  window.location.href = `perfil.html?aluno=${encodeURIComponent(nome)}`;
}
let alunoSelecionado = "";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  alunoSelecionado = params.get("aluno");

  const titulo = document.getElementById("titulo-perfil");
  if (alunoSelecionado && titulo) {
    titulo.textContent = `Perfil de ${alunoSelecionado}`;
  }
});

function abrirTreino(arquivo) {
  fetch(arquivo)
    .then(res => res.text())
    .then(texto => {
      document.getElementById("conteudo-arquivo").textContent = texto;
    })
    .catch(err => {
      document.getElementById("conteudo-arquivo").textContent = "Erro ao carregar arquivo: " + err;
    });
}

function voltar() {
  window.location.href = "index.html";
}
