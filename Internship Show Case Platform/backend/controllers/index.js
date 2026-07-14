/**
 * Controller barrel — re-export controllers for convenient imports.
 * Additional controllers (auth, profile, project, portfolio) land in later modules.
 */
const healthController = require('./healthController');

module.exports = {
  healthController,
};
