const axios = require('axios');

const NATIONALIZE_BASE_URL = 'https://api.nationalize.io';

async function fetchNationalityForName(name) {
  try {
    const response = await axios.get(NATIONALIZE_BASE_URL, {
      params: { name }
    });

    const data = response.data;

    if (!data || !Array.isArray(data.country) || data.country.length === 0) {
      return {
        name,
        country: null,
        probability: 0
      };
    }

    // Pick country with highest probability
    const topCountry = data.country.reduce((max, current) =>
      current.probability > max.probability ? current : max
    );

    return {
      name,
      country: topCountry.country_id || null,
      probability: topCountry.probability || 0
    };
  } catch (error) {
    console.error(`Failed to fetch nationality for ${name}:`, error.message);
    // On error, return safe fallback
    return {
      name,
      country: null,
      probability: 0
    };
  }
}

// Simple concurrency control: process names in chunks
async function enrichNamesBatch(names, concurrency = 5) {
  const results = [];

  for (let i = 0; i < names.length; i += concurrency) {
    const chunk = names.slice(i, i + concurrency);
    const chunkPromises = chunk.map((n) => fetchNationalityForName(n));
    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  return results;
}

module.exports = {
  enrichNamesBatch
};


