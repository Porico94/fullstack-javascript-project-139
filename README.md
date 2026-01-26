### Hexlet tests and linter status:
[![Actions Status](https://github.com/Porico94/fullstack-javascript-project-139/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Porico94/fullstack-javascript-project-139/actions)

# Hexlet Chat

Aplicación de chat en tiempo real construida con React y Redux Toolkit Query.

## 🚀 Demo en Vivo

[Ver aplicación desplegada](fullstack-javascript-project-139-production.up.railway.app)

## 🛠️ Desarrollo Local

### Instalar dependencias
```bash
npm install
cd frontend && npm install && cd ..
```

### Construir para producción
```bash
# Construir y copiar
npm run build

# Iniciar servidor
npm start

# Visita http://localhost:5001
```

## 📦 Tecnologías

- React 18
- Redux Toolkit Query
- @hexlet/chat-server
- Railway (deployment)

## 📂 Estructura del Proyecto
```
fullstack-javascript-project-139/
├── frontend/           # Aplicación React
│   ├── src/
│   └── public/
├── package.json        # Backend (servidor)
└── build/             # Build de producción (generado)
```