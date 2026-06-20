const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  createTour, updateTour, deleteTour,
  addFlight, updateFlight, deleteFlight,
} = require('../controllers/tour.controller');
const {
  getAllBookings, getBookingById, createOnsiteBooking, updateBooking,
} = require('../controllers/booking.controller');
const prisma = require('../lib/prisma');

router.use(authenticate, requireAdmin);

// ─── Stats ────────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalBookings, pendingBookings, confirmedBookings, cancelledBookings, totalTours, revenue] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.tour.count({ where: { isActive: true } }),
      prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { status: { not: 'CANCELLED' } } }),
    ]);
    res.json({
      totalBookings, pendingBookings, confirmedBookings, cancelledBookings,
      totalTours,
      totalRevenue: parseFloat(revenue._sum.totalPrice || 0),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Tour CRUD ────────────────────────────────────────────────────────────────
router.post('/tours', createTour);
router.put('/tours/:id', updateTour);
router.delete('/tours/:id', deleteTour);

// ─── Flight CRUD ──────────────────────────────────────────────────────────────
router.post('/tours/:tourId/flights', addFlight);
router.put('/flights/:id', updateFlight);
router.delete('/flights/:id', deleteFlight);

// ─── Travel Dates ─────────────────────────────────────────────────────────────
router.post('/tours/:tourId/dates', async (req, res) => {
  try {
    const { dateLabel } = req.body;
    if (!dateLabel) return res.status(400).json({ message: 'dateLabel is required' });
    const date = await prisma.travelDate.create({
      data: { tourId: req.params.tourId, dateLabel },
    });
    res.status(201).json(date);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/dates/:id', async (req, res) => {
  try {
    await prisma.travelDate.delete({ where: { id: req.params.id } });
    res.json({ message: 'Date deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Booking management ───────────────────────────────────────────────────────
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingById);
router.post('/bookings', createOnsiteBooking);
router.put('/bookings/:id', updateBooking);

// ─── User search ──────────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { email } = req.query;
    const users = await prisma.user.findMany({
      where: email ? { email: { contains: email, mode: 'insensitive' } } : {},
      select: { id: true, firstName: true, lastName: true, email: true, phone: true },
      take: 10,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
