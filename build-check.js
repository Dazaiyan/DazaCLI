import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runBuild() {
  try {
    console.log('Ejecutando npm run build...');
    const { stdout, stderr } = await execAsync('npm run build');
    console.log('Build exitoso:');
    console.log(stdout);
    if (stderr) console.error('Stderr:', stderr);
  } catch (error: any) {
    console.error('Error durante el build:');
    console.error(error.message);
  }
}

runBuild();
