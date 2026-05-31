const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const ctrl = require('../controllers/analysis.controller');

const router = Router();

router.post('/', authenticate, validate(schemas.startAnalysis), ctrl.start);
router.get('/:id/status', authenticate, validate(schemas.analysisStatus), ctrl.getStatus);

module.exports = router;
