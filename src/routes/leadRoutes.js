const express = require('express');
const { enrichLeads, listLeads } = require('../controllers/leadController');

const router = express.Router();

router.post('/enrich', enrichLeads);
router.get('/', listLeads);

module.exports = router;


