import { franc } from 'franc';

const francToTwoLetter: Record<string, string> = {
  por: 'pt',
  eng: 'en',
  spa: 'es',
};

export function detectLanguage(text: string): string {
  const code = franc(text)
  return francToTwoLetter[code] ?? 'en'
}
