document.addEventListener("DOMContentLoaded", () => {
  const userNav = document.getElementById("user-nav");
  if (!userNav) return;

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const isPages = window.location.pathname.includes("/pages/");
  const prefix = isPages ? "../pages/" : "./pages/";

  if (usuario) {
    userNav.innerHTML = `
      <a href="${prefix}perfil.html" class="linkNav">Hola, ${usuario.name}</a>
      <button id="logout" class="linkNav iniciarSesion" style="margin-left:10px;">Cerrar sesión</button>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.reload();
    });

  } else {
    userNav.innerHTML = `
      <a class="linkNav iniciarSesion" href="${prefix}iniciosesion.html">Iniciar sesión</a>
      <a class="linkNav" href="${prefix}registrarse.html">Registrarse</a>
    `;
  }
});

/*document.addEventListener("DOMContentLoaded", () => {
  const userNav = document.getElementById("user-nav");
  if (!userNav) return;

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Ajuste de rutas
  const isPages = window.location.pathname.includes("/pages/");
  const prefix = isPages ? "../pages/" : "./pages/";

  if (usuario) {
    userNav.innerHTML = `
      <a href="${prefix}perfil.html" class="linkNav">Hola, ${usuario.name}</a>
      <button id="logout" class="linkNav iniciarSesion" style="margin-left: 10px;">Cerrar sesión</button>
    `;

    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("usuario");
      window.location.reload();
    });

  } else {
    userNav.innerHTML = `
      <a class="linkNav iniciarSesion" href="${prefix}iniciosesion.html">Iniciar sesión</a>
      <a class="linkNav" href="${prefix}registrarse.html">Registrarse</a>
    `;
  }
});


*/