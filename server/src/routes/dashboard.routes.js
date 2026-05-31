const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const dashboardService = require('../services/dashboard.service');

const router = Router();

router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
