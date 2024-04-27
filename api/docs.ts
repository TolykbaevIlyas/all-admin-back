import { VercelRequest, VercelResponse } from '@vercel/node';
import * as swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from '../swaggerOptions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const specs = await swaggerJsdoc(swaggerOptions);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(specs);
  } catch (error) {
    console.error('Error generating Swagger specs:', error);
    res.status(500).json({ error: 'Error generating Swagger specs' });
  }
}