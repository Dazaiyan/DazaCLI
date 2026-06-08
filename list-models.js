import dotenv from 'dotenv';
import { logger } from './src/utils/logger.js';

dotenv.config();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'tu_gemini_api_key_aqui') {
    logger.error('GEMINI_API_KEY no está configurado en tu archivo .env');
    return;
  }

  logger.info('Consultando los modelos disponibles para tu API Key en la API de Google...');

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) {
      const errorText = await res.text();
      logger.error(`Error en la petición API (${res.status}): ${res.statusText}`);
      console.error(errorText);
      return;
    }

    const data = await res.json();
    if (data.models && Array.isArray(data.models)) {
      logger.success('Modelos encontrados con éxito:');
      data.models.forEach((m) => {
        console.log(` - ${m.name.replace('models/', '')} (${m.displayName})`);
      });
    } else {
      logger.warn('No se devolvieron modelos. Respuesta de la API:');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    logger.error('Error al realizar la petición:', error);
  }
}

main();
