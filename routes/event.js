const express = require('express');
const event = require('../api/event');

const router = new express.Router();

// create new Event
router.post('/', (req, res) => {
  event.createNewEvent(req, res);
});

// Get all Events
router.get('/', (req, res) => {
  event.getAllEvents(req, res);
});

// Get Element by ID
router.get('/:eventId', (req, res) => {
  event.returnEvent(req, res);
});

// Update Event Data
router.put('/:eventId', (req, res) => {
  event.updateEvent(req, res);
});

// Delete Event
router.delete('/:eventId', (req, res) => {
  event.deleteEvent(req, res);
});

module.exports = router;
