import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = process.env.CRYPTO_KEY || '0123456789abcdef0123456789abcdef'; // 32 bytes
const IV = process.env.CRYPTO_IV || 'abcdef9876543210'; // 16 bytes

function mask(str: string) {
  if (!str) return '';
  if (str.length <= 4) return '****';
  return str.slice(0, 2) + '****' + str.slice(-2);
}

export function encrypt(text: string): string {
  // 개인정보 암호화 접근 로깅
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] [crypto:encrypt] value=${mask(text)}`);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY, 'utf8'), Buffer.from(IV, 'utf8'));
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function decrypt(encrypted: string): string {
  // 개인정보 복호화 접근 로깅
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] [crypto:decrypt] value=${mask(encrypted)}`);
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY, 'utf8'), Buffer.from(IV, 'utf8'));
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
} 