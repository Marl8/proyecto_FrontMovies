import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  let usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (!usuario) {
    alert("Debes iniciar sesión para ver tu perfil.");
    window.location.href = "../pages/iniciosesion.html";
    return;
  }

  // Actualizar usuario desde MockAPI
  try {
    const res = await fetch(`${API_URL}/${usuario.id}`);
    if (res.ok) {
      usuario = await res.json();
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
    }
  } catch (err) {
    console.error("Error cargando usuario de MockAPI:", err);
  }

  // Rellenar datos
  document.getElementById("avatar").src = usuario.avatar || "https://placehold.co/120x120?text=User";
  document.getElementById("nombre").textContent = `${usuario.name} ${usuario.lastName}`;
  document.getElementById("email").textContent = usuario.email;
  document.getElementById("detalles").textContent = `Nacido el ${usuario.birthdate} | 🌍 ${usuario.country}`;

  // Cerrar sesión
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../index.html";
  });

  // Menú hamburguesa
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  toggle.addEventListener("click", () => sidebar.classList.toggle("open"));

  // Contenedores
  const peliculasContainer = document.getElementById("favoritos-container");
  const seriesContainer = document.getElementById("favoritos-series-container");

  function renderFavoritos() {
  // Películas
  peliculasContainer.innerHTML = "";
  if (!usuario.favorites || usuario.favorites.length === 0) {
    peliculasContainer.innerHTML = `
      <div class="no-favorites">
      <img src="../assets/img/no-favorites.png" alt="Sin favoritos">
      <p>Aún no agregaste películas favoritas</p>
    </div>
    `;
  } else {
    usuario.favorites.forEach(fav => {
      const card = document.createElement("div");
      card.classList.add("favorito-card");
      card.dataset.id = fav.id;
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${fav.poster}" alt="${fav.title}">
        <div class="favorito-info"><h4>${fav.title}</h4></div>
        <button class="btn-quitar">Quitar</button>
      `;
      peliculasContainer.appendChild(card);

      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-quitar")) {
          window.location.href = `../pages/detalle.html?id=${fav.id}`;
        }
      });

      card.querySelector(".btn-quitar").addEventListener("click", async e => {
        e.stopPropagation();
        usuario.favorites = usuario.favorites.filter(f => f.id != fav.id);
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        try {
          await fetch(`${API_URL}/${usuario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
          });
        } catch (err) {
          console.error("Error al quitar favorito en MockAPI:", err);
        }
        renderFavoritos();
      });
    });
  }

  // Series
  if (!seriesContainer) return;
  seriesContainer.innerHTML = "";
  if (!usuario.favoriteSeries || usuario.favoriteSeries.length === 0) {
    seriesContainer.innerHTML = `
      <div class="no-favorites">
      <img src="../assets/img/no-favorites.png" alt="Sin favoritos">
      <p>Aún no agregaste series favoritas</p>
    </div>
    `;
  } else {
    usuario.favoriteSeries.forEach(serie => {
      const card = document.createElement("div");
      card.classList.add("favorito-card"); 
      card.dataset.id = serie.id;
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${serie.poster}" alt="${serie.title}">
        <div class="favorito-info"><h4>${serie.title}</h4></div>
        <button class="btn-quitar">Quitar</button>
      `;
      seriesContainer.appendChild(card);

      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-quitar")) {
          window.location.href = `../pages/detalleserie.html?id=${serie.id}`;
        }
      });

      card.querySelector(".btn-quitar").addEventListener("click", async e => {
        e.stopPropagation();
        usuario.favoriteSeries = usuario.favoriteSeries.filter(s => s.id != serie.id);
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        try {
          await fetch(`${API_URL}/${usuario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
          });
        } catch (err) {
          console.error("Error al quitar serie en MockAPI:", err);
        }
        renderFavoritos();
      });
    });
  }
}


  // Función de renderizado
  /*function renderFavoritos() {
    // Películas
    peliculasContainer.innerHTML = "";
    usuario.favorites?.forEach(fav => {
      const card = document.createElement("div");
      card.classList.add("favorito-card");
      card.dataset.id = fav.id;
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${fav.poster}" alt="${fav.title}">
        <div class="favorito-info"><h4>${fav.title}</h4></div>
        <button class="btn-quitar">Quitar</button>
      `;
      peliculasContainer.appendChild(card);

      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-quitar")) {
          window.location.href = `../pages/detalle.html?id=${fav.id}`;
        }
      });

      card.querySelector(".btn-quitar").addEventListener("click", async e => {
        e.stopPropagation();
        usuario.favorites = usuario.favorites.filter(f => f.id != fav.id);
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        try {
          await fetch(`${API_URL}/${usuario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
          });
        } catch (err) {
          console.error("Error al quitar favorito en MockAPI:", err);
        }
        renderFavoritos();
      });
    });



    // Series
    if (!seriesContainer) return;
    seriesContainer.innerHTML = "";
    usuario.favoriteSeries?.forEach(serie => {
      const card = document.createElement("div");
      card.classList.add("favorito-card"); // misma clase que películas
      card.dataset.id = serie.id;
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${serie.poster}" alt="${serie.title}">
        <div class="favorito-info"><h4>${serie.title}</h4></div>
        <button class="btn-quitar">Quitar</button>
      `;
      seriesContainer.appendChild(card);

      card.addEventListener("click", (e) => {
        if (!e.target.classList.contains("btn-quitar")) {
          window.location.href = `../pages/detalleSerie.html?id=${serie.id}`;
        }
      });

      card.querySelector(".btn-quitar").addEventListener("click", async e => {
        e.stopPropagation();
        usuario.favoriteSeries = usuario.favoriteSeries.filter(s => s.id != serie.id);
        localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
        try {
          await fetch(`${API_URL}/${usuario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
          });
        } catch (err) {
          console.error("Error al quitar serie en MockAPI:", err);
        }
        renderFavoritos();
      });
    });
  }*/

  // Render inicial
  renderFavoritos();

  // Escuchar cambios de favoritos desde otra página
  window.addEventListener("favoritosActualizados", renderFavoritos);
});



/*import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const usuarioLS = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (!usuarioLS) {
    alert("Debes iniciar sesión para ver tu perfil.");
    window.location.href = "../pages/iniciosesion.html";

    return;
  }

  let usuario;

  try {
    // Traer usuario actualizado desde MockAPI
    const res = await fetch(`${API_URL}/${usuarioLS.id}`);
    if (!res.ok) throw new Error("No se pudo obtener el usuario de MockAPI");
    usuario = await res.json();

    // Guardar en LocalStorage para mantener sincronización
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
  } catch (err) {
    console.error(err);
    usuario = usuarioLS; // fallback a localStorage si falla el fetch
  }

  // Rellenar datos
  document.getElementById("avatar").src = usuario.avatar || "https://placehold.co/120x120?text=User";
  document.getElementById("nombre").textContent = `${usuario.name} ${usuario.lastName}`;
  document.getElementById("email").textContent = usuario.email;
  document.getElementById("detalles").textContent = `Nacido el ${usuario.birthdate} | 🌍 ${usuario.country}`;

  // Cerrar sesión
  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../index.html";
  });

  // Menú hamburguesa
  const toggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  toggle.addEventListener("click", () => sidebar.classList.toggle("open"));

  // Contenedor de favoritos
  const favoritosContainer = document.getElementById("favoritos-container");

  function renderFavoritos() {
    favoritosContainer.innerHTML = "";

    usuario.favorites?.forEach(fav => {
      const card = document.createElement('div');
      card.classList.add('favorito-card');
      card.dataset.id = fav.id;
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${fav.poster}" alt="${fav.title}">
        <div class="favorito-info"><h4>${fav.title}</h4></div>
        <button class="btn-quitar">Quitar</button>
      `;
      favoritosContainer.appendChild(card);

      // Click en tarjeta -> detalle
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-quitar')) {
          window.location.href = `../pages/detalle.html?id=${fav.id}`;
        }
      });

      // Botón quitar
      card.querySelector('.btn-quitar').addEventListener('click', async (e) => {
        e.stopPropagation();

        usuario.favorites = usuario.favorites.filter(f => f.id != fav.id);

        try {
          await fetch(`${API_URL}/${usuario.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
          });

          // Actualizar LocalStorage
          localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

          // Renderizar nuevamente
          renderFavoritos();
        } catch (err) {
          console.error("Error al quitar favorito en MockAPI:", err);
        }
      });
    });
  }

  renderFavoritos();

  // Escuchar cambios de favoritos desde otra página
  window.addEventListener('favoritosActualizados', async () => {
    try {
      const res = await fetch(`${API_URL}/${usuario.id}`);
      const usuarioActualizado = await res.json();
      usuario = usuarioActualizado;
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));
      renderFavoritos();
    } catch (err) {
      console.error("Error al actualizar favoritos:", err);
    }
  });
});


const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

// Mostrar películas favoritas
const peliculasContainer = document.getElementById("favoritos-container");
peliculasContainer.innerHTML = "";
usuario.favorites?.forEach(pelicula => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500/${pelicula.poster}" alt="${pelicula.title}">
    <h3>${pelicula.title}</h3>
    <button class="btn-quitar-pelicula" data-id="${pelicula.id}">Quitar de favoritos</button>
  `;
  peliculasContainer.appendChild(card);
});

*/
