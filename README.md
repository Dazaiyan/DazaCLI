# Gemini Agent Manta 🤖🌊

Un Asistente de Software Inteligente basado en Agentes, desarrollado en **Node.js** y **TypeScript**, utilizando el SDK oficial de **Google Gemini** (`@google/generative-ai`) y la técnica avanzada de **Function Calling** (Llamada a Funciones).

Este proyecto va más allá de un chatbot tradicional: conecta a Gemini 1.5 Flash como "cerebro" y le da herramientas para realizar acciones reales directamente en tu computadora, como leer, escribir, listar archivos y consultar internet.

---

## ✨ Características Especiales

* **Function Calling Loop Autónomo:** El agente decide cuándo necesita usar una herramienta local, ejecuta el código TypeScript correspondiente, procesa el resultado y continúa razonando de manera automática.
* **Sistema de Archivos Local:** Permite al agente leer, crear y listar directorios locales de manera autónoma.
* **Búsqueda y Conectividad Web:** El agente puede realizar peticiones HTTP GET a cualquier API o página web para consultar datos en tiempo real.
* **Interfaz CLI Premium:** Una experiencia de consola inmersiva con animaciones de carga, colores dinámicos por canal de logs y efectos de máquina de escribir (*typewriter effect*) para las respuestas de la IA.

---

## 📂 Estructura de Directorios

```text
gemini-agent-manta/
├── src/
│   ├── index.ts              # Punto de entrada de la CLI interactiva
│   ├── config.ts             # Carga y validación de variables de entorno (.env)
│   ├── agent.ts              # Clase SoftwareAgent (maneja el loop de llamadas a Gemini)
│   ├── tools/                # Registro e implementación de herramientas locales
│   │   ├── index.ts          # Registro central y ejecutor de herramientas
│   │   ├── fileTools.ts      # Herramientas de archivos (read_file, write_file, list_directory)
│   │   └── webTools.ts       # Herramientas de internet (fetch_url)
│   └── utils/
│       └── logger.ts         # Logger visual estético y efectos de consola
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Exclusiones de Git
├── tsconfig.json             # Configuración del compilador TypeScript
└── README.md                 # Documentación del proyecto
```

---

## 🚀 Guía de Instalación y Uso

### 1. Requisitos Previos
* Tener instalado **Node.js** (versión 18 o superior recomendada).
* Una clave de API de Gemini (puedes obtenerla gratis en [Google AI Studio](https://aistudio.google.com/)).

### 2. Clonar y Configurar
En tu terminal:
```bash
# Configurar la API Key
# Abre el archivo .env en tu editor de código favorito y reemplaza la clave de marcador de posición:
# GEMINI_API_KEY=tu_clave_de_gemini_aqui
```

### 3. Ejecutar en Desarrollo
Puedes correr el agente directamente en modo de desarrollo con recarga automática:
```bash
npm run dev
```

O si prefieres compilar y luego arrancar la aplicación compilada:
```bash
# Compilar TypeScript a JavaScript
npm run build

# Arrancar la aplicación compilada
npm run start
```

---

## 💡 Ejemplos de Peticiones para Probar

Prueba pidiéndole cosas como las siguientes en el chat:

1. **Gestión de archivos básicos:**
   > "Crea un archivo llamado saludo.txt que diga 'Hola desde el puerto de Manta, Ecuador' y luego muéstrame el contenido del directorio."
   
2. **Desarrollo y automatización:**
   > "Crea un archivo index.html básico con una estructura HTML5 bonita que use CSS en línea con un diseño moderno de color púrpura oscuro y agrégale un título de bienvenida. Cuando termines, lee el archivo para verificar que esté correcto."

3. **Consultas a internet en tiempo real:**
   > "Consulta la URL https://jsonplaceholder.typicode.com/users y hazme un resumen en español de los nombres y correos de las primeras 3 personas que aparezcan en esa API."

---

## 🛠️ Tecnologías Utilizadas

* **Lenguaje:** TypeScript / Node.js
* **Motor de IA:** Google Gemini SDK (`@google/generative-ai`)
* **Modelo:** `gemini-1.5-flash` (Optimizado para latencia ultra-baja y llamadas de función rápidas)
* **Visuales de CLI:** `picocolors` (colores rápidos y eficientes) y `ora` (loaders/spinners elegantes)
* **Entradas Interactivas:** `prompts` (prompts de consola dinámicos)
