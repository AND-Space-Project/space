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

router.post('/', async function(req, res, next) {
    try {
        res.json(await clubs.create(req.body));
    } catch (err) {
        console.error(`Error while creating club`, err.message);
        next(err);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
      res.json(await clubs.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating club`, err.message);
      next(err);
    }
});   

router.delete('/:id', async function(req, res, next) {
    try {
      res.json(await clubs.remove(req.params.id));
    } catch (err) {
      console.error(`Error while deleting club`, err.message);
      next(err);
    }
  });

module.exports = router;