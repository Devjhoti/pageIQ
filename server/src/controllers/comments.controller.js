const commentsService = require('../services/comments.service');

const list = async (req, res, next) => {
  try {
    const filters = {
      sentiment: req.query.sentiment,
      alert: req.query.alert,
      status: req.query.status,
    };
    const comments = await commentsService.listComments(req.user.id, filters);
    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

const stats = async (req, res, next) => {
  try {
    const stats = await commentsService.getCommentStats(req.user.id);
    res.json({ stats });
  } catch (error) {
    next(error);
  }
};

const reply = async (req, res, next) => {
  try {
    const { replyText } = req.validated.body || {};
    const comment = await commentsService.replyToComment(req.params.id, req.user.id, replyText);
    res.json({ comment });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await commentsService.deleteComment(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { list, stats, reply, remove };
