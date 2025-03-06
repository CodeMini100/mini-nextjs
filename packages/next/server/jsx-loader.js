import { transformFileSync } from '@babel/core';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

export function load(url, context, defaultLoad) {
  const filename = fileURLToPath(url);
  
  if (filename.endsWith('.jsx')) {
    const code = readFileSync(filename, 'utf8');
    const transformed = transformFileSync(filename, {
      presets: ['@babel/preset-react'],
      filename: filename
    });
    
    return {
      format: 'module',
      source: transformed.code,
      shortCircuit: true
    };
  }
  
  // Let Node.js handle all other files
  return defaultLoad(url, context, defaultLoad);
} 