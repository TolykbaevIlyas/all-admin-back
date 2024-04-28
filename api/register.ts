import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import { sha3_512 } from 'js-sha3';

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  const { username, email, password } = req.body;

  try {
    const userExistsQuery = await sql`SELECT EXISTS (SELECT 1 FROM users WHERE username = ${username} OR email = ${email})`;
    const userExists = userExistsQuery.rows[0].exists;

    if (userExists) {
      return res.status(400).json({ error: 'Пользователь с таким именем пользователя или адресом электронной почты уже существует' });
    }

    const hashedPassword = hashPassword(username,password);
    await sql`INSERT INTO users (username, email, password_hash) VALUES (${username}, ${email}, ${hashedPassword})`

    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({error: 'Что то- пошло не так'});
  }
}
function hashPassword(username, password, maxLength = 100) {
    const combinedString = `${username}:${password}`;
    const hashedPassword = sha3_512(combinedString);
    return hashedPassword.substring(0, maxLength);
}

module.exports = allowCors(handler)