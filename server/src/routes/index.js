const { Router } = require('express');
const authRoutes = require('./auth.routes');
const reportsRoutes = require('./reports.routes');
const analysisRoutes = require('./analysis.routes');
const competitorsRoutes = require('./competitors.routes');
const commentsRoutes = require('./comments.routes');
const dashboardRoutes = require('./dashboard.routes');
const facebookRoutes = require('./facebook.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportsRoutes);
router.use('/analysis', analysisRoutes);
router.use('/competitors', competitorsRoutes);
router.use('/comments', commentsRoutes);
router.use('/facebook', facebookRoutes);

module.exports = router;
