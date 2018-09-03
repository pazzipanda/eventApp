const Event = require('../models/events');
const Group = require('../models/groups');
const User = require('../models/user');
const winston = require('winston');


module.exports.createNewEvent = (req, res) => {
  const data = req.body;

  if (data === undefined || data.length === 0) {
    // res.status(400).send('Es wurden keine Daten gesendet');
    winston.log('error', 'lel');
    return;
  }

  const newEvent = new Event({
    name: data.name,
    description: data.description,
    location: data.location,
    date: new Date(data.datetime),
    groups: data.gId,
    owner: data.owner,
  });
  for (let i = 0; i < data.gId.length; i += 1) {
    Group.update({ _id: data.gId[i] },
      { $addToSet: { events: (newEvent._id.toString()) } }, (error) => {
        if (error) winston.log('error', error);
      });
    Group.findById(data.gId[i], (err, group) => {
      for (let j = 0; j < group.users.length; j += 1) {
        if (group.users[j] !== newEvent.owner) {
          User.update({ _id: group.users[j] },
            { $addToSet: { possibleEvents: (newEvent._id.toString()) } }, (er) => {
              if (er) winston.log('error', er);
            });
        } else {
          User.update({ _id: group.users[j] },
            { $addToSet: { activeEvents: (newEvent._id.toString()) } }, (er) => {
              if (er) winston.log('error', er);
            });
        }
      }
    });
  }
  newEvent.save((err) => {
    if (err) winston.log('error', err);
  });
  res.status(200).send('Event created!');
};

module.exports.getAllEvents = (req, res) => {
  Event.find((err, events) => {
    if (err) return winston.log('error', err);
    res.status(200).send(events);
    return null;
  });
};

module.exports.returnEvent = (req, res) => {
  const data = req.params;
  if (data === undefined || data.length === 0) {
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }
  Event.findById((data.eventId), (err, event) => {
    if (err) {
      res.status(400).send('Gruppe nicht gefunden');
      return;
    }
    res.status(200).send(event);
  });
};

// Update Event
module.exports.updateEvent = (req, res) => {
  const paramData = req.params;
  const bodyData = req.body;
  Event.findById((paramData.eventId), (err, event) => {
    if (err) {
      res.status(400).send('Gruppe nicht gefunden');
    }
// add or remove a group
    if (bodyData.gId != null) {
      Group.findById((bodyData.gId), (error, group) => {
        if (error) {
          res.status(400).send('Gruppe nicht gedunden');
        }
        let groupIsInArray = false;
        for (let i = 0; i < event.groups.length; i += 1) {
          if (event.groups[i] === bodyData.gId) {
            groupIsInArray = true;
          }
        }
        if (groupIsInArray) {
          Event.update({ _id: paramData.eventId },
          { $pull: { groups: bodyData.gId } }, (er) => {
            if (er) res.status(400).send('Event nicht gefunden');
          });
          Group.update({ _id: group._id },
              { $pull: { events: event._id.toString() } }, (er) => {
                if (er) res.status(400).send('Event nicht gefunden');
                else res.status(200).send('Gruppe erfolgreich entfernt');
              });
        } else {
          Group.update({ _id: bodyData.gId },
              { $addToSet: { events: (paramData.eventId) } }, (er) => {
                if (er) {
                  res.status(400).send('Event nicht gefunden');
                }
              });
          Event.update({ _id: paramData.eventId },
            { $addToSet: { groups: bodyData.gId } }, (er) => {
              if (er) {
                res.status(400).send('Event nicht gefunden');
              }
            });
          res.status(200).send('Gruppe erfolgreich hinzugefügt');
        }
      });
    }

    // Change Events name
    if (bodyData.name != null) {
      Event.update({ _id: paramData.eventId }, { $set: { name: bodyData.name } }, (error) => {
        if (error) res.status(400).send('Event nicht gefunden');
        else res.status(200).send('Name erfolgreich geändert');
      });
    }

    // Change Events description
    if (bodyData.description != null) {
      Event.update({ _id: paramData.eventId },
        { $set: { description: bodyData.description } }, (error) => {
          if (error) res.status(400).send('Event nicht gefunden');
          else res.status(200).send('Beschreibung erfolgreich geändert');
        });
    }

    // Change Events date
    if (bodyData.date != null) {
      Event.update({ _id: paramData.eventId }, { $set: { date: bodyData.date } }, (error) => {
        if (error) res.status(400).send('Event nicht gefunden');
        else res.status(200).send('Zeitpunkt erfolgreich geändert');
      });
    }

    // Change Events location
    if (bodyData.location != null) {
      Event.update({ _id: paramData.eventId },
        { $set: { location: bodyData.location } }, (error) => {
          if (error) res.status(400).send('Event nicht gefunden');
          else res.status(200).send('Ort erfolgreich geändert');
        });
    }
  });
};


// delete Event
module.exports.deleteEvent = (req, res) => {
  const data = req.params;
  if (data === undefined || data.length === 0) {
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }
  Event.findById(data.eventId, (err, event) => {
    if (err) res.status(400).send('Event konnte nicht gefunden werden');
    else {
      for (let i = 0; i < event.groups.length; i += 1) {
        Group.update({ _id: event.groups[i] },
        { $pull: { events: data.eventId } }, (er) => {
          if (er) res.status(400).send('Event nicht gefunden');
          else {
            Group.findById((event.groups[i]), (erro, group) => {
              if (erro) res.status(400).send('Gruppe konnte nicht gefunden werden');
              for (let j = 0; j < group.users.length; j += 1) {
                User.update({ _id: group.users[j] },
                { $pull: { events: data.eventId } }, (error) => {
                  if (error) res.status(400).send('Event nicht gefunden');
                  return null;
                });
              }
            });
          }
        });
      }
    }
  });
  Event.findByIdAndRemove(data.eventId, (err) => {
    if (err) {
      res.status(400).send('Event konnte nicht gelöscht werden');
    } else res.status(200).send('Event erfolgreich gelöscht');
  });
};
