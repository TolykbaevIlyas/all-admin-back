import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  allowCors({req,res})
  return res.json({
    message: `Hello go to /api/docs!`,
  })
}