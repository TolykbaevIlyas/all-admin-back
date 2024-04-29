import type { VercelRequest, VercelResponse } from '@vercel/node'

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

function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        res.status(201).json({ message: `Пользователь успешно зарегистрирован ${username}` });
    }
    else{
        return res.json({
            message: `Hello world!`,
          })
    }

}

module.exports = allowCors(handler)