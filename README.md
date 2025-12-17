To-Do List App Móvil para Android

Aplicacion creada con el fin de utilizar para llevar un control de tareas pendientes y completadas.

A continuacion encontraras las instrucciones para probar la aplicacion en tu entorno utilizando la aplicacion de Expo Go.

Requisitos Previos:

- Node.js (versión 14 o superior)
- npm o yarn
- Expo CLI
- Expo Go app en tu teléfono Android (descárgala de Google Play Store)

------------------------------------------------------------------------
Instalacion de dependencias 

# 1. Instalar Expo CLI globalmente
npm install -g expo-cli

# 2. Clonar el Repo
git remote add origin https://github.com/tdsjavedu/todo-app-proyectoFinal

# 3. Instalar dependencias necesarias
npm install lucide-react-native
npm install @react-native-async-storage/async-storage

# 4. Ejecutar la aplicacion
npm start

# 5. Descargar la aplicacion EXPO Go

# 6. Al iniciar la aplicacion con "npm start" se le brindara un codigo QR con el cual puede acceder a la aplicacion directamente desde el celular y realizar las pruebas correspondientes.

Características Implementadas
- Pantalla de Inicio
- Agregar Tareas
- Formulario con título, descripción y tipo
- Lista de Tareas
- Detalles de Tarea


Tecnologías Utilizadas

- Framework: React Native con Expo
- Almacenamiento: AsyncStorage (persistencia local)
- Iconos: Emojis nativos
- Diseño: StyleSheet de React Native

Estructura del proyecto:
TodoListApp/
├── node_modules/
├── assets/
│   ├── icon.png
│   └── splash.png
├── App
|    |__index.tsx
├── app.json
├── package.json
├── babel.config.js
└── package-lock.json