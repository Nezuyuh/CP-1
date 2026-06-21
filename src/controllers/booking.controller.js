const prisma = require('../lib/prisma');
const { uploadFile } = require('../lib/s3storage');

const bookingInclude = {
  tour: { include: { travelDates: true } },
  travelDate: true,
  user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
  documents: true,
};

// ─── User ─────────────────────────────────────────────────────────────────────

const createBooking = async (req, res) => {
  try {
    const { tourId, travelDateId, paxCount = 1, roomType, notes } = req.body;
    if (!tourId || !travelDateId) {
      return res.status(400).json({ message: 'tourId and travelDateId are required' });
    }
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const totalPrice = tour.pricePerPerson
      ? parseFloat(tour.pricePerPerson) * paxCount
      : null;

    const booking = await prisma.booking.create({
      data: { userId: req.user.id, tourId, travelDateId, paxCount, roomType, notes, totalPrice },
      include: bookingInclude,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: bookingInclude,
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!req.files?.length) return res.status(400).json({ message: 'No files provided' });

    const saved = await Promise.all(
      req.files.map(async (file) => {
        const path = `${booking.id}/${Date.now()}-${file.originalname}`;
        const publicUrl = await uploadFile(path, file.buffer, file.mimetype);
        return prisma.bookingDocument.create({
          data: {
            bookingId: booking.id,
            fileName: file.originalname,
            fileUrl: publicUrl,
            fileType: file.mimetype,
            fileSize: file.size,
          },
        });
      })
    );
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Admin ────────────────────────────────────────────────────────────────────

const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: bookingInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.booking.count({ where }),
    ]);
    res.json({ bookings, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: bookingInclude,
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOnsiteBooking = async (req, res) => {
  try {
    const { userId, tourId, travelDateId, paxCount = 1, roomType, notes } = req.body;
    if (!userId || !tourId || !travelDateId) {
      return res.status(400).json({ message: 'userId, tourId and travelDateId are required' });
    }
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const totalPrice = tour.pricePerPerson
      ? parseFloat(tour.pricePerPerson) * paxCount
      : null;

    const booking = await prisma.booking.create({
      data: {
        userId, tourId, travelDateId, paxCount, roomType, notes,
        totalPrice, isOnsiteBooking: true, status: 'CONFIRMED',
      },
      include: bookingInclude,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { status, notes, paxCount, roomType } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status, notes, paxCount, roomType },
      include: bookingInclude,
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createBooking, getMyBookings, uploadDocuments,
  getAllBookings, getBookingById, createOnsiteBooking, updateBooking,
};
