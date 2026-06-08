import { registerTool } from './index.js';
import { SchemaType } from '@google/generative-ai';

// Herramienta para realizar peticiones HTTP
registerTool({
  declaration: {
    name: 'fetch_url',
    description: 'Realiza una petición HTTP GET para obtener contenido de una URL o API.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        url: {
          type: SchemaType.STRING,
          description: 'La URL de la página o API de la cual obtener información.',
        },
      },
      required: ['url'],
    },
  },
  execute: async ({ url }: { url: string }) => {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GeminiAgent/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Petición HTTP fallida con estado ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return {
        url,
        contentType,
        data,
      };
    } else {
      const text = await response.text();
      // Truncar el texto si es extremadamente largo para no sobrecargar el contexto de Gemini
      const truncatedText = text.length > 10000 ? text.substring(0, 10000) + '\n[... Contenido truncado por longitud ...]' : text;
      return {
        url,
        contentType,
        data: truncatedText,
      };
    }
  },
});
