const express = require('express');
const group = require('../api/group');

const router = new express.Router();

// new group: name, imagePath, userId
router.post('/', (req, res) => {
  group.createNewGroup(req, res);
});

// Get  all Groups
router.get('/', (req, res) => {
  group.getAllGroups(req, res);
});

// Get Group by ID
router.get('/:gId', (req, res) => {
  group.returnGroup(req, res);
});
// Get all Groups a user is not part of
router.get('/user/:userId', (req, res) => {
  group.returnAllButUserGroups(req, res);
});

// Update Group Data
router.put('/:gId', (req, res) => {
  group.updateGroup(req, res);
});

// Delete User
router.delete('/:gId', (req, res) => {
  group.deleteGroup(req, res);
});


module.exports = router;
