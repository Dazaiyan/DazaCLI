import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from './src/utils/logger.js';

dotenv.config();

const modelsToTest = [
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
  'gemini-pro-latest'
];

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'tu_gemini_api_key_aqui') {
    logger.error('GEMINI_API_KEY no está configurado en tu archivo .env');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  logger.info('Probando la cuota de diferentes modelos para tu API Key...');

  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Di la palabra "OK"');
      const text = result.response.text().trim();
      logger.success(`Modelo '${modelName}' está ACTIVO y tiene cuota (Respondió: ${text})`);
    } catch (error) {
      const errorMsg = error.message || String(error);
      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        logger.error(`Modelo '${modelName}' falló por CUOTA (429 / Quota Exceeded)`);
      } else if (errorMsg.includes('404') || errorMsg.includes('not found')) {
        logger.warn(`Modelo '${modelName}' falló por NO ENCONTRADO (404)`);
      } else {
        logger.warn(`Modelo '${modelName}' falló por otro error: ${errorMsg.substring(0, 100)}`);
      }
    }
  }
}

main();
