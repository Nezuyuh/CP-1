const prisma = require('../lib/prisma');
const { uploadTourImage: storeImage } = require('../lib/s3storage');

const fullInclude = {
  travelDates: true,
  flights: { orderBy: { flightOrder: 'asc' } },
  itinerary: {
    orderBy: { dayOrder: 'asc' },
    include: { activities: { orderBy: { activityOrder: 'asc' } } },
  },
};

// ─── Public ───────────────────────────────────────────────────────────────────

const getTours = async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      where: { isActive: true },
      include: { travelDates: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await prisma.tour.findFirst({
      where: { id: req.params.id, isActive: true },
      include: fullInclude,
    });
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Admin: Tour CRUD ─────────────────────────────────────────────────────────

const createTour = async (req, res) => {
  try {
    const { travelDates, flights, itinerary, pricePerPerson, ...rest } = req.body;
    const tour = await prisma.tour.create({
      data: {
        ...rest,
        pricePerPerson: pricePerPerson ? parseFloat(pricePerPerson) : null,
        travelDates: travelDates
          ? { create: travelDates.map((d) => ({ dateLabel: d })) }
          : undefined,
        flights: flights
          ? {
              create: flights.map((f, i) => ({ ...f, flightOrder: i })),
            }
          : undefined,
        itinerary: itinerary
          ? {
              create: itinerary.map((day, i) => ({
                day: day.day,
                title: day.title,
                accommodation: day.accommodation,
                dayOrder: i,
                activities: {
                  create: (day.activities || []).map((desc, j) => ({
                    description: desc,
                    activityOrder: j,
                  })),
                },
              })),
            }
          : undefined,
      },
      include: fullInclude,
    });
    res.status(201).json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTour = async (req, res) => {
  try {
    const { travelDates, flights, itinerary, pricePerPerson, ...rest } = req.body;
    if (pricePerPerson !== undefined) rest.pricePerPerson = parseFloat(pricePerPerson);
    const tour = await prisma.tour.update({
      where: { id: req.params.id },
      data: rest,
      include: fullInclude,
    });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTour = async (req, res) => {
  try {
    await prisma.tour.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ message: 'Tour deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── Admin: Flight CRUD ───────────────────────────────────────────────────────

const addFlight = async (req, res) => {
  try {
    const { tourId } = req.params;
    const count = await prisma.flight.count({ where: { tourId } });
    const flight = await prisma.flight.create({
      data: { tourId, ...req.body, flightOrder: count },
    });
    res.status(201).json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await prisma.flight.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFlight = async (req, res) => {
  try {
    await prisma.flight.delete({ where: { id: req.params.id } });
    res.json({ message: 'Flight deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadTourImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const url = await storeImage(`${req.params.id}.${ext}`, req.file.buffer, req.file.mimetype);
    await prisma.tour.update({ where: { id: req.params.id }, data: { image: url } });
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTours, getTourById,
  createTour, updateTour, deleteTour,
  addFlight, updateFlight, deleteFlight,
  uploadTourImage,
};
