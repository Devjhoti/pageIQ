const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validate');
const ctrl = require('../controllers/auth.controller');

const router = Router();

router.post('/register', validate(schemas.register), ctrl.register);
router.post('/login', validate(schemas.login), ctrl.login);
router.post('/google', ctrl.googleAuth);
router.get('/me', authenticate, ctrl.getMe);
router.put('/profile', authenticate, validate(schemas.updateProfile), ctrl.updateProfile);
router.delete('/account', authenticate, ctrl.deleteAccount);

module.exports = router;
