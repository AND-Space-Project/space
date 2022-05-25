const express = require('express');
const router = express.Router();
const clubDays = require('../services/clubDays');

router.get('/', async function(req, res, next) {
  try {
    res.json(await clubDays.getAll());
  } catch (err) {
    console.error(`Error while getting club days `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
        res.json(await clubDays.create(req.body));
    } catch (err) {
        console.error(`Error while creating club day`, err.message);
        next(err);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
      res.json(await clubDays.update(req.params.id, req.body.Notice, req.body.NumDesks));
    } catch (err) {
      console.error(`Error while updating club day`, err.message);
      next(err);
    }
});   

module.exports = router;