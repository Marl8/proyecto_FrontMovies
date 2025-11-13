import { API_URL } from "./config.js";

//const API_URL = "https://69144a1cf34a2ff1170f3fc5.mockapi.io/front-movies/users";

const form = document.querySelector("form");
console.log("Script de login cargado correctamente");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Por favor ingresa tu email y contraseña.");
    return;
  }

  try {
    // Buscar usuario por email
    const response = await fetch(`${API_URL}?email=${email}`);
    const users = await response.json();

    if (users.length === 0) {
      alert("No existe un usuario con ese email.");
      return;
    }

    const user = users[0];

    // Validar contraseña
    if (user.password !== password) {
      alert("Contraseña incorrecta.");
      return;
    }

    // Guardar sesión (simulada)
    localStorage.setItem("usuario", JSON.stringify(user));
    alert(`Bienvenido, ${user.name}!`);
    window.location.href = "../index.html"; // redirige al inicio o dashboard

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
});
