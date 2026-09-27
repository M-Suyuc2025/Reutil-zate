import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Código legible de 8 caracteres alfanuméricos en mayúsculas.
export function generateConfirmationCode(length = 8): string {
  const bytes = randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    const byte = bytes[i] ?? 0;
    code += ALPHABET[byte % ALPHABET.length] ?? "";
  }
  return code;
}