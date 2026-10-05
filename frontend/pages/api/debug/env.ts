import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    NEXT_PUBLIC_DJANGO_HOST_URL: process.env.NEXT_PUBLIC_DJANGO_HOST_URL,
    NODE_ENV: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
  });
}