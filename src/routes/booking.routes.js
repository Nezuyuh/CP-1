const router = require('express').Router();
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  uploadDocuments,
} = require('../controllers/booking.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

router.use(authenticate);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.post('/:id/documents', upload.array('files', 10), uploadDocuments);

module.exports = router;
