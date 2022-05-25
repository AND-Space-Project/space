const express = require('express');
const router = express.Router();
const bookings = require('../services/bookings');

router.get('/', async function(req, res, next) {
  try {
    res.json(await bookings.get());
  } catch (err) {
    console.error(`Error while getting bookings `, err.message);
    next(err);
  }
});

router.post('/', async function(req, res, next) {
    try {
        res.json(await bookings.create(req.body));
    } catch (err) {
        console.error(`Error while creating booking`, err.message);
        next(err);
    }
});

router.put('/:id', async function(req, res, next) {
    try {
      res.json(await bookings.update(req.params.id, req.body));
    } catch (err) {
      console.error(`Error while updating booking`, err.message);
      next(err);
    }
});   

router.delete('/:email', async function(req, res, next) {
    try {
      res.json(await bookings.remove(req.params.email));
    } catch (err) {
      console.error(`Error while deleting booking`, err.message);
      next(err);
    }
  });

module.exports = router;