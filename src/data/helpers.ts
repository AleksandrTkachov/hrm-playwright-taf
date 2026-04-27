import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AuthenticationData {
  email: string;
  password: string;
  description: string;
}

export function getAuthenticationData(): AuthenticationData[] {
  const filePath = path.resolve(__dirname, './input.csv');
  return parse(fs.readFileSync(filePath), {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  }) as AuthenticationData[];
}
