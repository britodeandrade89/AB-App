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
