import prompts from 'prompts';
import ora from 'ora';
import pc from 'picocolors';
import { SoftwareAgent } from './agent.js';
import { logger } from './utils/logger.js';

// Cargar herramientas para que se registren en el sistema
import './tools/fileTools.js';
import './tools/webTools.js';

async function main() {
  // Limpiar pantalla al inicio
  console.clear();
  
  // Convertir la ruta absoluta local a formato Unix-like elegante (~/...)
  const displayPath = process.cwd()
    .replace(/^C:\\Users\\[^\\]+/, '~')
    .replace(/\\/g, '/');

  // Definir bloques de sombreado con colores individuales para efecto mosaico/degradado
  const W = pc.white('█');  // Blanco sólido
  const w = pc.white('▓');  // Blanco textura densa
  const G = pc.gray('█');   // Gris sólido
  const g = pc.gray('▓');   // Gris textura densa
  const m = pc.gray('▒');   // Gris textura media
  const l = pc.gray('░');   // Gris textura ligera / claro

  // Construir el logo D en un mosaico de tonos más delgado (cada línea mide exactamente 9 caracteres)
  const dLine1 = W + w + G + g + m + l + pc.gray('▄') + '  ';
  const dLine2 = w + G + g + '  ' + pc.gray('▀') + m + W + ' ';
  const dLine3 = G + g + m + '   ' + w + W + ' ';
  const dLine4 = g + m + l + '  ' + pc.gray('▄') + m + W + ' ';
  const dLine5 = m + l + m + g + G + w + pc.white('▀') + '  ';

  // Construir cabecera con columnas alineadas
  const asciiArt = 
    `  ${dLine1}      ${pc.bold('Daza CLI 1.0.0')}\n` +
    `  ${dLine2}      ${pc.cyan('Gemini Flash Lite (Stable)')}\n` +
    `  ${dLine3}      ${pc.dim(displayPath)}\n` +
    `  ${dLine4}\n` +
    `  ${dLine5}\n`;
    
  console.log(asciiArt);
  
  logger.info('Inicializando el Asistente de Software Inteligente...');
  
  let agent: SoftwareAgent;
  try {
    agent = new SoftwareAgent();
    logger.success('Cerebro del agente listo (Gemini Flash Lite configurado).');
  } catch (error: any) {
    logger.error('Error al inicializar el agente. Verifica que tu GEMINI_API_KEY esté en el archivo .env', error);
    process.exit(1);
  }

  logger.divider();
  console.log(
    `Soy un agente inteligente con acceso a este sistema.\n` +
    `Acciones permitidas: ${pc.bold('leer archivos')}, ${pc.bold('escribir archivos')}, ${pc.bold('listar directorios')} y ${pc.bold('consultar internet')}.\n` +
    `Escribe tu requerimiento de desarrollo, o escribe ${pc.red('"salir"')} para finalizar.`
  );
  logger.divider();

  while (true) {
    const response = await prompts({
      type: 'text',
      name: 'prompt',
      message: pc.magenta('❯'),
      validate: (value) => value.trim().length > 0 || 'Por favor ingresa una petición.'
    });

    // Validar si el usuario salió con Ctrl+C
    if (response.prompt === undefined) {
      logger.info('\nSaliendo del agente.');
      break;
    }

    const userInput = response.prompt.trim();

    if (userInput.toLowerCase() === 'salir') {
      logger.info('Saliendo del agente.');
      break;
    }

    // Iniciar loader estético de ora sin emojis
    const spinner = ora({
      text: pc.cyan('Daza AI procesando y ejecutando...'),
      color: 'cyan',
    }).start();

    try {
      const reply = await agent.sendMessage(userInput);
      spinner.stop();
      
      logger.divider();
      await logger.typewriter(reply);
      logger.divider();
      console.log();
    } catch (error: any) {
      spinner.stop();
      logger.error('Ocurrió un error al procesar tu solicitud:', error);
      logger.divider();
    }
  }
}

main().catch((err) => {
  logger.error('Error fatal de ejecución:', err);
});
