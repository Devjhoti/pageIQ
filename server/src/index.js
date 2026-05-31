const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const { errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', routes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`PageIQ API running on port ${env.PORT} [${env.NODE_ENV}]`);
});

module.exports = app;
