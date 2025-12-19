const Lead = require('../models/Lead');
const { enrichNamesBatch } = require('../services/nationalizeService');

// POST /api/leads/enrich
async function enrichLeads(req, res) {
  try {
    const { names } = req.body;

    if (!Array.isArray(names) || names.length === 0) {
      return res.status(400).json({ message: 'names must be a non-empty array' });
    }

    const cleanedNames = names
      .map((n) => (typeof n === 'string' ? n.trim() : ''))
      .filter((n) => n.length > 0);

    if (cleanedNames.length === 0) {
      return res.status(400).json({ message: 'No valid names provided' });
    }

    const enriched = await enrichNamesBatch(cleanedNames, 5);

    const leadsToCreate = enriched.map((item) => {
      const status = item.probability > 0.6 ? 'Verified' : 'To Check';

      return {
        name: item.name,
        country: item.country,
        probability: item.probability,
        status,
        syncedToCRM: false,
        syncedAt: null
      };
    });

    const createdLeads = await Lead.insertMany(leadsToCreate);

    res.status(201).json(createdLeads);
  } catch (error) {
    console.error('Error enriching leads:', error);
    res.status(500).json({ message: 'Failed to enrich leads' });
  }
}

// GET /api/leads?status=Verified|To%20Check
async function listLeads(req, res) {
  try {
    const { status } = req.query;
    const filter = {};

    if (status && ['Verified', 'To Check'].includes(status)) {
      filter.status = status;
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error('Error listing leads:', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
}

module.exports = {
  enrichLeads,
  listLeads
};


