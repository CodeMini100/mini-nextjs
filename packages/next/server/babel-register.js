import babelRegister from '@babel/register';
import { register } from 'node:module';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Register babel for .js files
babelRegister({
  presets: ['@babel/preset-react'],
  extensions: ['.js', '.jsx'],
  cache: false
});

// Register custom loader for .jsx files
register('./jsx-loader.js', pathToFileURL(path.join(__dirname, './jsx-loader.js'))); 