const Group = require('../models/groups');
const User = require('../models/user');
const Event = require('../models/events');
const winston = require('winston');

winston.level = 'debug';

module.exports.createNewGroup = (req, res) => {
  const data = req.body;
  if (data === undefined || data.length === 0) {
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }

  const newGroup = new Group({
    name: data.name,
    description: data.description,
    users: [data.owner],
    events: [],
  });
  newGroup.save((err) => {
    if (err) return winston.log('error', err);
    User.update({ _id: data.owner }, { $addToSet: { groups: (newGroup._id.toString()) } }, (er) => {
      if (er) {
        res.status(400).send('User nicht gefunden');
      }
    });

    res.status(200).send('Gruppe erstellt!');
    return null;
  });
};

// returns all groups
module.exports.getAllGroups = (req, res) => {
  Group.find((err, groups) => {
    if (err) winston.log('error', err);
    res.status(200).send(groups);
    return null;
  });
};


// returns all groups but the ones a given user is in
module.exports.returnAllButUserGroups = (req, res) => {
  const data = req.params;
  Group.find((err, groups) => {
    if (err) winston.log('error', err);
    User.findById((data.userId), (error, user) => {
      for (let i = 0; i < groups.length; i += 1) {
        for (let j = 0; j < user.groups.length; j += 1) {
          if (user.groups[j] === groups[i]._id.toString()) {
            groups.splice(i, 1);
          }
        }
      }
      res.status(200).send(groups);
    });
    return null;
  });
};

// returns a Group
module.exports.returnGroup = (req, res) => {
  const data = req.params;
  if (data === undefined || data.length === 0) {
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }
  Group.findById((data.gId), (err, group) => {
    if (err) {
      res.status(400).send('Gruppe nicht gefunden');
      return;
    }
    res.status(200).send(group);
  });
};

// Update Group
module.exports.updateGroup = (req, res) => {
  const paramData = req.params;
  const bodyData = req.body;

// Change groups name
  if (bodyData.name != null) {
    Group.update({ _id: paramData.gId }, { $set: { name: bodyData.name } }, (error) => {
      if (error) res.status(400).send('Gruppe nicht gefunden');
      else res.status(200).send('Name erfolgreich geändert');
    });
  }

  // Change groups description
  if (bodyData.description != null) {
    Group.update({ _id: paramData.gId },
        { $set: { description: bodyData.description } }, (error) => {
          if (error) res.status(400).send('Gruppe nicht gefunden');
          else res.status(200).send('Beschreibung erfolgreich geändert');
        });
  }

  // Change groups image
  if (bodyData.image != null) {
    Group.update({ _id: paramData.gId }, { $set: { image: bodyData.image } }, (error) => {
      if (error) res.status(400).send('Gruppe nicht gefunden');
      else res.status(200).send('Gruppenbild erfolgreich geändert');
    });
  }
};

// delete Group
module.exports.deleteGroup = (req, res) => {
  const data = req.params;
  if (data === undefined || data.length === 0) {
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }
  Group.findById(data.gId, (err, group) => {
    if (err) res.status(400).send('Gruppe konnte nicht gefunden werden');
    else {
      if (group.users !== null) {
        for (let i = 0; i < group.users.length; i += 1) {
          User.update({ _id: group.users[i] },
            { $pull: { groups: data.gId } }, (er) => {
              if (er) res.status(400).send('Nutzer nicht gefunden');
              return null;
            });
        }
      }
      if (group.events !== null) {
        for (let i = 0; i < group.events.length; i += 1) {
          Event.update({ _id: group.events[i] },
            { $pull: { groups: data.gId } }, (er) => {
              if (er) res.status(400).send('Gruppe hier nicht gefunden');
            });
        }
      }
    }
  });
  Group.findByIdAndRemove(data.gId, (err) => {
    if (err) {
      res.status(400).send('Gruppe konnte nicht gelöscht werden');
    } else res.status(200).send('Gruppe erfolgreich gelöscht');
  });
};
