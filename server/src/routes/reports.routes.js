const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const ctrl = require('../controllers/reports.controller');

const router = Router();

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, validate(schemas.getReport), ctrl.getById);
router.delete('/:id', authenticate, validate(schemas.getReport), ctrl.remove);

module.exports = router;
