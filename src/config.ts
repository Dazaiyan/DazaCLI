import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno del archivo .env
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === 'tu_gemini_api_key_aqui') {
  console.error('\x1b[31m[Error] GEMINI_API_KEY no configurada. Por favor, crea un archivo .env con tu clave.\x1b[0m');
  console.error('\x1b[33mObtén tu clave gratuita en: https://aistudio.google.com/\x1b[0m\n');
  process.exit(1);
}

export const config = {
  apiKey,
  modelName: 'gemini-flash-lite-latest',
};
