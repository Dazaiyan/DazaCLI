import { FunctionDeclaration } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

export interface Tool {
  declaration: FunctionDeclaration;
  execute: (args: any) => Promise<any> | any;
}

// Registro global de herramientas disponibles para Gemini
export const toolsRegistry = new Map<string, Tool>();

/**
 * Registra una herramienta en el sistema.
 */
export function registerTool(tool: Tool) {
  toolsRegistry.set(tool.declaration.name, tool);
}

/**
 * Retorna la estructura de herramientas formateada para la API de Gemini.
 */
export function getGeminiTools() {
  const declarations: FunctionDeclaration[] = [];
  for (const tool of toolsRegistry.values()) {
    declarations.push(tool.declaration);
  }
  return [
    {
      functionDeclarations: declarations,
    },
  ];
}

/**
 * Ejecuta una herramienta por su nombre pasándole los argumentos de la IA.
 */
export async function executeTool(name: string, args: any): Promise<any> {
  const tool = toolsRegistry.get(name);
  if (!tool) {
    throw new Error(`La herramienta '${name}' no está registrada.`);
  }

  logger.toolStart(name, args);
  try {
    const result = await tool.execute(args);
    
    // Generar un resumen del resultado para el log
    let summary = '';
    if (typeof result === 'string') {
      summary = result.length > 60 ? result.substring(0, 60) + '...' : result;
    } else {
      summary = JSON.stringify(result);
      if (summary.length > 60) summary = summary.substring(0, 60) + '...';
    }

    logger.toolSuccess(name, summary);
    return result;
  } catch (error: any) {
    logger.toolError(name, error);
    return {
      error: error.message || String(error),
    };
  }
}


