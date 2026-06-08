import fs from 'fs/promises';
import path from 'path';
import { registerTool } from './index.js';
import { SchemaType } from '@google/generative-ai';

// Asegurarse de que el directorio padre existe antes de escribir
async function ensureDir(filePath: string) {
  const dirname = path.dirname(filePath);
  try {
    await fs.mkdir(dirname, { recursive: true });
  } catch (err) {
    // Si ya existe no hay problema
  }
}

// 1. Herramienta para LEER archivos
registerTool({
  declaration: {
    name: 'read_file',
    description: 'Lee el contenido de un archivo de texto del disco local.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        path: {
          type: SchemaType.STRING,
          description: 'La ruta relativa o absoluta del archivo a leer.',
        },
      },
      required: ['path'],
    },
  },
  execute: async ({ path: filePath }: { path: string }) => {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    const content = await fs.readFile(resolvedPath, 'utf-8');
    return {
      path: filePath,
      content,
    };
  },
});

// 2. Herramienta para ESCRIBIR archivos
registerTool({
  declaration: {
    name: 'write_file',
    description: 'Crea o sobrescribe un archivo con el contenido especificado.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        path: {
          type: SchemaType.STRING,
          description: 'La ruta relativa o absoluta del archivo a crear/sobrescribir.',
        },
        content: {
          type: SchemaType.STRING,
          description: 'El contenido que se guardará en el archivo.',
        },
      },
      required: ['path', 'content'],
    },
  },
  execute: async ({ path: filePath, content }: { path: string; content: string }) => {
    const resolvedPath = path.resolve(process.cwd(), filePath);
    await ensureDir(resolvedPath);
    await fs.writeFile(resolvedPath, content, 'utf-8');
    return {
      path: filePath,
      status: 'success',
      message: 'Archivo escrito correctamente.',
    };
  },
});

// 3. Herramienta para LISTAR directorios
registerTool({
  declaration: {
    name: 'list_directory',
    description: 'Lista los archivos y carpetas dentro de un directorio.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        path: {
          type: SchemaType.STRING,
          description: 'La ruta del directorio a listar. Si no se pasa, lista el directorio actual (".").',
        },
      },
    },
  },
  execute: async ({ path: dirPath = '.' }: { path?: string }) => {
    const resolvedPath = path.resolve(process.cwd(), dirPath);
    const entries = await fs.readdir(resolvedPath, { withFileTypes: true });
    
    const result = entries.map((entry) => ({
      name: entry.name,
      type: entry.isDirectory() ? 'directory' : 'file',
    }));

    return {
      directory: dirPath,
      items: result,
    };
  },
});
