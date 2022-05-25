const express = require('express');
const router = express.Router();
const clubs = require('../services/clubs');

router.get('/', async function(req, res, next) {
  try {
    res.json(await clubs.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting clubs `, err.message);
    next(err);
  }
});

module.exports = router;