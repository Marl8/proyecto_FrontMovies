document.addEventListener("DOMContentLoaded", () => {
  const userNav = document.getElementById("user-nav");
  if (!userNav) return;

  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado")); // <- unificado

  const isPages = window.location.pathname.includes("/pages/");
  const prefix = isPages ? "../pages/" : "./pages/";

  if (usuario) {
    userNav.innerHTML = `
      <a href="${prefix}perfil.html" class="linkNav">Hola, ${usuario.name}</a>
      <button id="logout" class="linkNav iniciarSesion" style="margin-left:10px;">Cerrar sesión</button>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      // Limpiar localStorage
      localStorage.removeItem("usuarioLogueado");

      // Disparar evento global para que otras páginas escuchen
      window.dispatchEvent(new Event('usuarioDeslogueado'));

      // Recargar la página
      window.location.reload();
    });

  } else {
    userNav.innerHTML = `
      <a class="linkNav" href="${prefix}registrarse.html">Registrarse</a>    
      <a class="linkNav iniciarSesion" href="${prefix}iniciosesion.html">Iniciar sesión</a>
    `;
  }
});

