import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Minimal auth endpoint: if Authorization header has Bearer token 'test-token' returns a mock user, else 401
app.get('/api/auth/me', (req, res) => {
  const auth = req.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = auth.split(' ')[1];
  if (token === 'test-token') {
    return res.json({ user: { id: '1', email: 'test@example.com' } });
  }

  return res.status(401).json({ error: 'Invalid token' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${PORT}`);
});
