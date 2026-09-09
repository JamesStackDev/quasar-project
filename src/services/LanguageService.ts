import { franc } from 'franc';

const francTwoLetter: Record<string, string> = {
  por: 'pt-BR',
  eng: 'en-US',
  spa: 'es-ES',
};

export function detectLanguage(text:string): string {
    const code = franc(text)
    return francTwoLetter[code] ?? "en"
}