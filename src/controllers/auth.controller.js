const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const sign = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const safeUser = ({ password, ...u }) => u;

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'email, password, firstName and lastName are required' });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const user = await prisma.user.create({
      data: { email, password: await bcrypt.hash(password, 12), firstName, lastName, phone },
    });
    res.status(201).json({ token: sign(user.id), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: sign(user.id), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = (req, res) => {
  res.json({ user: safeUser(req.user) });
};

module.exports = { register, login, getMe };
