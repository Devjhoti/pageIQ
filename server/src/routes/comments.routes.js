const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const ctrl = require('../controllers/comments.controller');

const router = Router();

router.get('/', authenticate, ctrl.list);
router.get('/stats', authenticate, ctrl.stats);
router.put('/:id/reply', authenticate, validate(schemas.replyComment), ctrl.reply);
router.delete('/:id', authenticate, validate(schemas.deleteComment), ctrl.remove);

module.exports = router;
