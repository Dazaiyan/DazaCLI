import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import { config } from './config.js';
import { getGeminiTools, executeTool } from './tools/index.js';

export class SoftwareAgent {
  private chat: ChatSession;

  constructor() {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({
      model: config.modelName,
      tools: getGeminiTools() as any, // Cast to any to align with SDK expectations if needed
      systemInstruction:
        'Eres un Asistente de Software Inteligente de nivel Senior conectado al sistema de archivos local y a la red.\n' +
        'Usa las herramientas disponibles para responder a las solicitudes del usuario de forma directa y práctica.\n' +
        'Cuando crees archivos de código o realices cambios, asegúrate de escribir código limpio, documentado y bien estructurado.\n' +
        'Si te piden escribir código, escríbelo directamente en el archivo correspondiente usando las herramientas en lugar de solo mostrar el código en la pantalla.\n' +
        'No le expliques al usuario cómo hacer las cosas paso a paso en el sistema si puedes automatizarlo tú mismo usando tus herramientas. ¡Sé un agente activo!',
    });

    this.chat = model.startChat();
  }

  /**
   * Envia un mensaje al agente y procesa recursivamente las llamadas a funciones (Function Calling)
   * hasta obtener la respuesta de texto final.
   */
  public async sendMessage(message: string): Promise<string> {
    let result = await this.chat.sendMessage(message);
    let response = result.response;

    // Procesar llamadas a herramientas mientras Gemini lo requiera
    let calls = response.functionCalls();
    while (calls && calls.length > 0) {
      const toolResponses: any[] = [];

      for (const call of calls) {
        const { name, args } = call;
        
        // Ejecutar la función localmente en base al registro
        const executionResult = await executeTool(name, args);

        toolResponses.push({
          functionResponse: {
            name,
            response: { result: executionResult },
          },
        });
      }

      // Enviar las respuestas de las funciones de vuelta a Gemini
      result = await this.chat.sendMessage(toolResponses);
      response = result.response;
      calls = response.functionCalls();
    }

    return response.text();
  }
}
