const express = require('express');
const {
  searchProjects,
  getPublicDiscoveryProject,
  searchInterns,
  getExploreMeta,
} = require('../controllers/discoverController');

const router = express.Router();

// All explore endpoints are public (employer / visitor discovery)
router.get('/meta', getExploreMeta);
router.get('/projects', searchProjects);
router.get('/projects/:id', getPublicDiscoveryProject);
router.get('/interns', searchInterns);

module.exports = router;
