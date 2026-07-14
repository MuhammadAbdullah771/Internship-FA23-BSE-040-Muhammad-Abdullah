const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware');

connectDB();

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Intern Project Showcase Platform API',
    version: '1.0.0',
  });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(
    `Server running in ${config.nodeEnv} mode on port ${config.port}`
  );
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
