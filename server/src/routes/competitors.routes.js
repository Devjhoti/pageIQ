const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const ctrl = require('../controllers/competitors.controller');

const router = Router();

router.get('/', authenticate, ctrl.list);
router.post('/', authenticate, validate(schemas.addCompetitor), ctrl.add);
router.get('/:id', authenticate, validate(schemas.getCompetitor), ctrl.getById);
router.delete('/:id', authenticate, validate(schemas.deleteCompetitor), ctrl.remove);

module.exports = router;
