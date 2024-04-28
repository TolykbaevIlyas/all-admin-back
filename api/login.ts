
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoints for user authentication
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       '200':
 *         description: Authentication successful
 *       '401':
 *         description: Invalid username or password
 *       '405':
 *         description: Method not allowed
 */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { sha3_512 } from 'js-sha3';

const sessions = new Map();

export default async function handler(req: VercelRequest, res: VercelResponse) {
    
    // res.setHeader('Access-Control-Allow-Credentials', 'true')
    // res.setHeader('Access-Control-Allow-Origin', '*')
    // // another common pattern
    // // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    // res.setHeader(
    //   'Access-Control-Allow-Headers',
    //   'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    // )
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'POST');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // res.status(200).end();


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
