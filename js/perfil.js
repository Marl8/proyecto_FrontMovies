document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    alert("Debes iniciar sesión para ver tu perfil.");
    window.location.href = "./login.html";
    return;
  }

  // Rellenar datos
  document.getElementById("avatar").src = usuario.avatar || "https://placehold.co/120x120?text=User";
  document.getElementById("nombre").textContent = `${usuario.name} ${usuario.lastName}`;
  document.getElementById("email").textContent = usuario.email;
  document.getElementById("detalles").textContent = `Nacido el ${usuario.birthdate} | 🌍 ${usuario.country}`;

  // Cerrar sesión
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
  });

  // Menú hamburguesa
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
});
