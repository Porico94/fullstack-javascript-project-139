# 💬 Hexlet Chat
### Aplicación de chat en tiempo real con canales, autenticación y mensajería instantánea

---

## 📖 Sobre el Proyecto

**Hexlet Chat** es una aplicación web fullstack inspirada en Slack que permite a múltiples usuarios comunicarse en tiempo real a través de canales. Los usuarios pueden registrarse, iniciar sesión, crear canales, renombrarlos, eliminarlos y enviar mensajes que aparecen instantáneamente en la pantalla de todos los usuarios conectados.

Es el proyecto más completo del portafolio: integra **React**, **Redux Toolkit**, **WebSockets**, autenticación con **JWT** y monitoreo de errores en producción con **Rollbar** — una combinación que refleja el stack tecnológico de aplicaciones web profesionales reales.

---

## 🛠️ Tecnologías Utilizadas

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

| Librería | Rol en el proyecto |
|---|---|
| `react` + `react-dom` | UI declarativa basada en componentes |
| `@reduxjs/toolkit` + `react-redux` | Estado global de canales y mensajes |
| `socket.io-client` | Comunicación en tiempo real con el servidor |
| `react-router-dom` | Navegación entre páginas (Login, Signup, Chat, 404) |
| `axios` | Peticiones HTTP a la API REST del backend |
| `formik` + `yup` | Manejo y validación de formularios |
| `react-i18next` + `i18next` | Internacionalización (inglés y español) |
| `react-toastify` | Notificaciones emergentes de éxito y error |
| `leo-profanity` | Filtro automático de lenguaje inapropiado en mensajes |
| `rollbar` + `@rollbar/react` | Monitoreo y reporte de errores en producción |

---

## ✨ Características Principales

- **Autenticación completa**: registro de usuarios, inicio de sesión y cierre de sesión con tokens **JWT** guardados en `localStorage`
- **Rutas protegidas**: el chat solo es accesible para usuarios autenticados, los no autenticados son redirigidos automáticamente a `/login`
- **Mensajería en tiempo real** vía **WebSockets**: los mensajes de todos los usuarios aparecen instantáneamente sin recargar la página
- **Gestión completa de canales**: crear, renombrar y eliminar canales (los canales predeterminados no son eliminables)
- **Filtro de lenguaje inapropiado**: los mensajes con palabras ofensivas se censuran automáticamente con `leo-profanity`
- **Notificaciones toast** para cada acción exitosa o fallida (canal creado, error de red, etc.)
- **Soporte multiidioma**: la interfaz está disponible en inglés y español
- **Monitoreo de errores en producción** con Rollbar: los errores críticos se reportan automáticamente con contexto detallado
- **Página 404** para rutas no existentes

---

## ⚙️ Instalación y Configuración

### Pre-requisitos

- `Node.js` v18 o superior
- `npm` v8 o superior

### Variables de entorno

Crea un archivo `.env` en la carpeta `frontend/`:

```env
REACT_APP_ROLLBAR_TOKEN=tu_token_de_rollbar
```

### Pasos

```bash
# 1. Clona el repositorio
git clone https://github.com/Porico94/Proyecto-Hexlet-Chat

# 2. Instala las dependencias del backend
cd Proyecto-Hexlet-Chat
npm install

# 3. Instala las dependencias del frontend
cd frontend
npm install

# 4. Levanta el servidor backend (puerto 5001)
cd ..
npm run build
npm start

# 5. En otra terminal, levanta el frontend (puerto 3000)
cd frontend
npm start
```

La app estará disponible en `http://localhost:3000`

### Build para producción

```bash
cd Proyecto-Hexlet-Chat
npm run build
npm start
```

---

## 💡 Aprendizajes

> ### 🏆 El reto técnico clave: sincronizar el estado de Redux con los eventos de WebSocket en tiempo real

El problema más difícil del proyecto no fue construir la interfaz de usuario (UI) ni conectar la API REST, sino **mantener el estado de Redux sincronizado con los eventos que llegaban por WebSocket en tiempo real**. Al principio estaba manejando los mensajes y canales nuevos solo desde la respuesta HTTP, el usuario enviaba un mensaje, hacía `POST /messages`, y actualizaba el estado con el resultado. El problema fue que eso solo funcionaba para el usuario que enviaba: los demás usuarios conectados no veían nada hasta que recargaban la página.

La solución fue crear un hook personalizado `useSocket` que escucha los eventos del servidor y despacha acciones de Redux directamente cuando llegan:

```javascript
// src/hooks/useSocket.js
socket.on('newMessage', (message) => {
  dispatch(addMessage(message));       // → Redux actualiza el estado
});                                    // → React re-renderiza el chat

socket.on('newChannel', (channel) => {
  dispatch(addChannel(channel));       // → la lista de canales se actualiza
});                                    // → para TODOS los usuarios conectados

socket.on('removeChannel', ({ id }) => {
  dispatch(removeChannel(id));
});
```

Esto creó un flujo de dos carriles para el mismo dato: cuando **yo** creo un canal, el servidor responde al `POST` y Redux se actualiza por la promesa de `createAsyncThunk`. Cuando **otro usuario** crea un canal, Redux se actualiza por el evento WebSocket. El estado siempre refleja la realidad del servidor sin importar quién hizo el cambio.

Un segundo reto fue gestionar correctamente la **duplicación**: tanto la respuesta HTTP como el evento WebSocket podían llegar casi al mismo tiempo, un mensaje podía agregarse dos veces al estado. La solución fue verificar si el ID ya existe antes de insertar:

```javascript
// En messagesSlice.js
addMessage: (state, action) => {
  const exists = state.messages.find((msg) => msg.id === action.payload.id);
  if (!exists) {
    state.messages.push(action.payload);
  }
},
```

Este proyecto me enseñó que en aplicaciones con tiempo real, **el estado no solo cambia por las acciones del usuario actual** — también cambia por eventos externos. Diseñar el estado global pensando en esa dualidad es una habilidad clave en el desarrollo de aplicaciones colaborativas.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas clara:

```
Servidor (Backend, puerto 5001)
    ↕ HTTP REST     ↕ WebSocket
Frontend React (puerto 3000)
    ↓
[Redux Store]
    ├── channels: { channels[], currentChannelId, loading }
    └── messages: { messages[], loading }
    ↓
[Componentes React]
    ├── Pages: ChatPage, LoginPage, SignupPage, NotFoundPage
    ├── Components: Navbar, ChannelItem, PrivateRoute
    └── Modals: AddChannel, RenameChannel, DeleteChannel
```

---

## 📂 Estructura del Proyecto

```
frontend/src/
├── api/
│   └── ApiClient.js          # Instancia de axios con JWT en cada petición
├── components/
│   ├── ChannelItem.jsx        # Item de canal con dropdown de acciones
│   ├── Navbar.jsx             # Barra de navegación con botón de logout
│   ├── PrivateRouter.jsx      # Redirige a /login si no hay sesión activa
│   └── modals/
│       ├── AddChannelModal.jsx
│       ├── RenameChannelModal.jsx
│       └── DeleteChannelModal.jsx
├── contexts/
│   └── AuthContext.jsx        # Context con login, logout, signup y estado de sesión
├── hooks/
│   └── useSocket.js           # Hook que conecta WebSocket y despacha a Redux
├── pages/
│   ├── ChatPage.jsx           # Página principal: canales + mensajes + formulario
│   ├── LoginPage.jsx          # Formulario de login con Formik + Yup
│   ├── SignupPage.jsx         # Formulario de registro con validación
│   └── NotFoundPage.jsx       # Página 404
├── store/
│   ├── store.js               # Configuración del store de Redux
│   └── slices/
│       ├── channelsSlice.js   # Estado + AsyncThunks de canales
│       └── messagesSlice.js   # Estado + AsyncThunks de mensajes
├── locales/
│   ├── en/translation.json    # Traducciones en inglés
│   └── es/translation.json    # Traducciones en español
├── i18n.js                    # Configuración de i18next
├── App.js                     # Rutas principales con React Router
└── index.js                   # Entry point: Redux + Rollbar + AuthProvider
```

---

## 👤 Autor

**Pool Rimari** — Desarrollador Full-stack JavaScript

[![GitHub](https://img.shields.io/badge/GitHub-Porico94-181717?style=flat&logo=github)](https://github.com/Porico94)

### Hexlet tests and linter status:
[![Actions Status](https://github.com/Porico94/fullstack-javascript-project-139/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Porico94/fullstack-javascript-project-139/actions)
