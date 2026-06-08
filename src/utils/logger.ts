import pc from 'picocolors';

export const logger = {
  info: (message: string) => {
    console.log(`${pc.gray('[INFO]')} ${pc.dim(message)}`);
  },

  success: (message: string) => {
    console.log(`${pc.cyan('[SUCCESS]')} ${pc.cyan(message)}`);
  },

  warn: (message: string) => {
    console.log(`${pc.yellow('[WARN]')} ${pc.yellow(message)}`);
  },

  error: (message: string, error?: any) => {
    console.error(`${pc.red('[ERROR]')} ${pc.bold(pc.red(message))}`);
    if (error) {
      console.error(pc.dim(error.stack || error));
    }
  },

  agent: (message: string) => {
    console.log(`${pc.green('[DAZA AI]')} ${pc.green(message)}`);
  },

  toolStart: (toolName: string, args: any) => {
    console.log(
      `${pc.blue('[RUN]')} ${pc.bold(toolName)} ${pc.dim(JSON.stringify(args))}`
    );
  },

  toolSuccess: (toolName: string, resultSummary: string) => {
    console.log(
      `${pc.green('[OK]')} ${pc.bold(toolName)} -> ${pc.dim(resultSummary)}`
    );
  },

  toolError: (toolName: string, error: any) => {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(
      `${pc.red('[FAIL]')} ${pc.bold(toolName)} -> ${pc.red(errorMsg)}`
    );
  },

  divider: () => {
    console.log(pc.dim('──────────────────────────────────────────────────'));
  },

  heading: (title: string) => {
    console.log(`\n${pc.bold(pc.gray('=== ' + title.toUpperCase() + ' ==='))}\n`);
  },

  // Simulates a typewriter typing effect for AI responses
  typewriter: async (text: string, speedMs: number = 5): Promise<void> => {
    process.stdout.write(`${pc.green('[DAZA AI] ')}`);
    for (const char of text) {
      process.stdout.write(pc.green(char));
      await new Promise((resolve) => setTimeout(resolve, speedMs));
    }
    console.log();
  }
};
