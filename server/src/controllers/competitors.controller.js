const competitorsService = require('../services/competitors.service');

const list = async (req, res, next) => {
  try {
    const competitors = await competitorsService.listCompetitors(req.user.id);
    res.json({ competitors });
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const competitor = await competitorsService.addCompetitor(req.user.id, req.validated.body);
    res.status(201).json({ competitor });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const competitor = await competitorsService.getCompetitorById(req.params.id, req.user.id);
    res.json({ competitor });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await competitorsService.removeCompetitor(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { list, add, getById, remove };
