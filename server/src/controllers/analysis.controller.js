const analysisService = require('../services/analysis.service');

const start = async (req, res, next) => {
  try {
    const { pageUrl, brandName, analysisType, fbAccessToken } = req.validated.body;
    const name = brandName || new URL(pageUrl).hostname.replace('www.', '').split('.')[0];
    const queueItem = await analysisService.startAnalysis(req.user.id, pageUrl, name, analysisType, fbAccessToken);
    res.status(201).json({ analysis: queueItem });
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const status = await analysisService.getAnalysisStatus(req.params.id, req.user.id);
    res.json({ analysis: status });
  } catch (error) {
    next(error);
  }
};

module.exports = { start, getStatus };
