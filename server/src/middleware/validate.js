const { z } = require('zod');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.validated = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};

const schemas = {
  register: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required').max(100),
      email: z.string().email('Invalid email'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
  }),
  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(1, 'Password is required'),
    }),
  }),
  updateProfile: z.object({
    body: z.object({
      name: z.string().min(1).max(100).optional(),
      avatar_url: z.string().url().nullable().optional(),
      plan: z.enum(['Free', 'Pro', 'Agency']).optional(),
    }),
  }),
  startAnalysis: z.object({
    body: z.object({
      pageUrl: z.string().url('Invalid URL').refine(
        (url) => url.includes('facebook.com') || url.includes('fb.com'),
        'Must be a Facebook page URL'
      ),
      brandName: z.string().min(1, 'Brand name is required').max(200).optional(),
      analysisType: z.enum(['general', 'comprehensive']).default('general'),
      fbAccessToken: z.string().optional().nullable(),
    }),
  }),
  addCompetitor: z.object({
    body: z.object({
      pageUrl: z.string().url('Invalid URL'),
      pageName: z.string().min(1, 'Page name is required').max(200),
      category: z.string().max(100).optional(),
      followers: z.number().int().min(0).optional(),
    }),
  }),
  replyComment: z.object({
    params: z.object({ id: z.string().uuid('Invalid comment ID') }),
    body: z.object({
      replyText: z.string().min(1).max(1000).optional(),
    }),
  }),
  deleteComment: z.object({
    params: z.object({ id: z.string().uuid('Invalid comment ID') }),
  }),
  getReport: z.object({
    params: z.object({ id: z.string().uuid('Invalid report ID') }),
  }),
  deleteCompetitor: z.object({
    params: z.object({ id: z.string().uuid('Invalid competitor ID') }),
  }),
  getCompetitor: z.object({
    params: z.object({ id: z.string().uuid('Invalid competitor ID') }),
  }),
  analysisStatus: z.object({
    params: z.object({ id: z.string().uuid('Invalid analysis ID') }),
  }),
};

module.exports = { validate, schemas };
