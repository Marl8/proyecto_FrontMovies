import { API_URL } from "./config.js";

const form = document.querySelector("form");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensaje.textContent = "";

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    mensaje.textContent = "Por favor ingresa tu email y contraseña.";
    mensaje.style.color = "red";
    return;
  }

  try {
    // Traer todos los usuarios
    const response = await fetch(API_URL);
    const users = await response.json();

    const user = users.find(u => u.email.toLowerCase() === email);

    if (!user) {
      mensaje.textContent = "No existe un usuario con ese email.";
      mensaje.style.color = "red";
      return;
    }

    // Verificar contraseña hasheada
    const hashedInput = await hashPassword(password);
    if (user.password !== hashedInput) {
      mensaje.textContent = "Contraseña incorrecta.";
      mensaje.style.color = "red";
      return;
    }

    // Login exitoso
    localStorage.setItem("usuario", JSON.stringify(user));
    mensaje.textContent = `Bienvenido, ${user.name}! Redirigiendo...`;
    mensaje.style.color = "green";

    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1000);

  } catch (error) {
    mensaje.textContent = "Hubo un problema al conectar con el servidor.";
    mensaje.style.color = "red";
    console.error("Error al iniciar sesión:", error);
  }
});

// Función hash SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}


//const API_URL = "https://69144a1cf34a2ff1170f3fc5.mockapi.io/front-movies/users";
/*
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
});*/
