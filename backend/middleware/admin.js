const ADMIN_SECRET = process.env.ADMIN_SECRET || 'change-me-in-production';

export function adminOnly(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing admin bearer token' });
  }
  const token = header.split(' ')[1];
  if (token !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden: admin access required' });
  }
  next();
}
