require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const tourRoutes = require('./routes/tour.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || true, credentials: true }));
app.use(express.json());
app.use('/promo-img', express.static(path.join(__dirname, '../promo-img')));

app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.get('/api/debug', async (req, res) => {
  const checks = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    JWT_SECRET: !!process.env.JWT_SECRET,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    STORAGE_ENDPOINT: !!process.env.STORAGE_ENDPOINT,
    STORAGE_REGION: !!process.env.STORAGE_REGION,
    STORAGE_ACCESS_KEY_ID: !!process.env.STORAGE_ACCESS_KEY_ID,
    STORAGE_SECRET_ACCESS_KEY: !!process.env.STORAGE_SECRET_ACCESS_KEY,
    NODE_ENV: process.env.NODE_ENV || 'not set',
  };
  try {
    const prisma = require('./lib/prisma');
    await prisma.$queryRaw`SELECT 1`;
    checks.db_connection = 'ok';
  } catch (e) {
    checks.db_connection = e.message;
  }
  res.json(checks);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

module.exports = app;
