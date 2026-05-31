const reportsService = require('../services/reports.service');

const list = async (req, res, next) => {
  try {
    const reports = await reportsService.listReports(req.user.id);
    res.json({ reports });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const report = await reportsService.getReportById(req.params.id, req.user.id);
    res.json({ report });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await reportsService.deleteReport(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { list, getById, remove };
