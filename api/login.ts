import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { sha3_512 } from 'js-sha3';

const sessions = new Map();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const hashedPassword = hashPassword(username, password);
      const userQuery = await sql`SELECT * FROM users WHERE username = ${username} AND password_hash = ${hashedPassword}`;

      if (userQuery.rows.length === 1) {
        const sessionId = generateSessionId();
        sessions.set(sessionId, username);
        res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Secure; SameSite=Strict`);

        res.status(200).json({ message: 'Авторизация успешна' });
      } else {
        res.status(401).json({ error: 'Неверные имя пользователя или пароль' });
      }
    } catch (error) {
      console.error('Ошибка при попытке авторизации:', error);
      res.status(500).json({ error: 'Что-то пошло не так' });
    }
  } else {
    res.status(405).json({ error: 'Метод не разрешен' });
  }
}

function hashPassword(username, password, maxLength = 100) {
  const combinedString = `${username}:${password}`;
  const hashedPassword = sha3_512(combinedString);
  return hashedPassword.substring(0, maxLength);
}

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
