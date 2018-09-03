const User = require('../models/user');
const Group = require('../models/groups');
const Event = require('../models/events');
const winston = require('winston');

winston.level = 'debug';
// Create User
module.exports.createUser = (req, res) => {
  const data = req.body;
  if (data === undefined || data.length === 0) {
    winston.log('error', 'Fehler beim Nutzer erstellen: Es wurden keine Daten gesendet.');
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }

  const newUser = new User({
    name: data.name,
    email: data.email,
    description: ' ',
    password: data.password,
    image: 'userImage/avatar.jpeg',
    groups: [],
    possibleEvents: [],
    activeEvents: [],
  });
  newUser.save((err) => {
    if (err) {
      winston.log();
      res.status(400).send('User konnte nicht erstellt werden');
    }
    res.status(200).send('User erstellt!');
    return null;
  });
};


// Get User
module.exports.getUser = (req, res) => {
  const data = req.params;
  if (data === undefined || data.length === 0) {
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }
  User.findById((data.userId), (err, user) => {
    if (err) {
      res.status(400).send('User nicht gefunden');
      return;
    }

    const returnGroups = [];
    const returnPossibleEvents = [];
    const returnActiveEvents = [];
    for (let i = 0; i < user.groups.length; i += 1) {
      Group.findById((user.groups[i]), (error, group) => {
        returnGroups.push(group);
      });
    }
    for (let i = 0; i < user.possibleEvents.length; i += 1) {
      Event.findById((user.possibleEvents[i]), (error, event) => {
        returnPossibleEvents.push(event);
      });
    }
    for (let i = 0; i < user.activeEvents.length; i += 1) {
      Event.findById((user.activeEvents[i]), (error, event) => {
        returnActiveEvents.push(event);
      });
    }
    setTimeout(function () {
      const returnValue = {
        name: user.name,
        email: user.email,
        description: user.description,
        password: user.password,
        groups: returnGroups,
        activeEvents: returnActiveEvents,
        possibleEvents: returnPossibleEvents,
      };
      res.status(200).send(returnValue);
    }, 100);
  });
};

// Get all Users
module.exports.getAllUsers = (req, res) => {
  User.find((err, users) => {
    res.send(users);
    return null;
  });
};

// Update User
module.exports.updateUser = (req, res) => {
  const dates = req.params;
  const data = req.body;
  User.findById((dates.userId), (err, user) => {
    if (err) {
      res.status(400).send('User nicht gefunden');
    }

// add or remove a group
    if (data.gId != null) {
      Group.findById((data.gId), (error, group) => {
        if (error) {
          res.status(400).send('Gruppe nicht gefunden');
          return;
        }
        let groupIsInArray = false;
        for (let i = 0; i < user.groups.length; i += 1) {
          if (user.groups[i] === data.gId) {
            groupIsInArray = true;
          }
        }
        if (groupIsInArray) {
          User.update({ _id: dates.userId },
          { $pull: { groups: data.gId } }, (er) => {
            if (er) res.status(400).send('Gruppe nicht gefunden');
          });
          Group.update({ _id: group._id },
              { $pull: { users: dates.userId } }, (er) => {
                if (er) res.status(400).send('User Hier nicht gefunden');
                else res.status(200).send('Gruppe erfolgreich entfernt');
              });
          for (let i = 0; i < group.events.length; i += 1) {
            User.findByIdAndUpdate(dates.userId,
              { $pull: { possibleEvents: (group.events[i]) } }, (er) => {
                if (er) winston.log('error', err);
              });
            User.findByIdAndUpdate(dates.userId,
              { $pull: { activeEvents: (group.events[i]) } }, (er) => {
                if (er) winston.log('error', err);
              });
          }
        } else {
          Group.update({ _id: data.gId },
              { $addToSet: { users: (dates.userId) } }, (er) => {
                if (er) {
                  res.status(400).send('User nicht gefunden');
                }
              });
          for (let i = 0; i < group.events.length; i += 1) {
            User.update({ _id: dates.userId },
              { $addToSet: { possibleEvents: (group.events[i]) } }, (er) => {
                if (er) winston.log('error', er);
              });
          }
          User.update({ _id: dates.userId }, { $addToSet: { groups: (data.gId) } }, (er) => {
            if (er) {
              res.status(400).send('User nicht gefunden');
            }
            res.status(200).send('Gruppe erfolgreich hinzugefügt');
          });
        }
      });
    }

    // participate in event or cancel participation
    if (data.eventId != null) {
      let userTakesPartInEvent = -1;
      let eventPossible = -1;

      for (let i = 0; i < user.activeEvents.length; i += 1) {
        if (user.activeEvents[i] === data.eventId) {
          userTakesPartInEvent = i;
          eventPossible = i;
        }
      }
      for (let i = 0; i < user.possibleEvents.length; i += 1) {
        if (user.possibleEvents[i] === data.eventId) {
          eventPossible = i;
        }
      }
      if (eventPossible >= 0) {
        if (userTakesPartInEvent === -1) {
          User.findByIdAndUpdate(
            dates.userId,
            { $addToSet: { activeEvents: (data.eventId) } }, (erro) => {
              if (erro) res.status(400).send('User nicht gefunden');
              else {
                User.update(
                { _id: dates.userId },
                { $pull: { possibleEvents: data.eventId } }, (error) => {
                  if (error) res.status(400).send('User nicht gefunden');
                  else res.status(200).send('Eventteilnahme erfolgreich');
                });
              }
            });
        } else {
          User.findByIdAndUpdate(
          dates.userId,
          { $addToSet: { possibleEvents: (data.eventId) } }, (erro) => {
            if (erro) res.status(400).send('User nicht gefunden');
            else {
              User.update(
              { _id: dates.userId },
              { $pull: { activeEvents: data.eventId } }, (error) => {
                if (error) res.status(400).send('User nicht gefunden');
                else res.status(200).send('Eventabsage erfolgreich');
              });
            }
          });
        }
      } else {
        res.status(400).send('Konnte dem Event nicht zu-/absagen');
      }
    }

    // Change users name
    if (data.name != null) {
      User.update({ _id: dates.userId }, { $set: { name: data.name } }, (error) => {
        if (error) res.status(400).send('User nicht gefunden');
        else res.status(200).send('Name erfolgreich geändert');
      });
    }

    // Change users description
    if (data.description != null) {
      User.update({ _id: dates.userId }, { $set: { description: data.description } }, (error) => {
        if (error) res.status(400).send('User nicht gefunden');
        else res.status(200).send('Beschreibung erfolgreich geändert');
      });
    }
  });
};

// delete User
module.exports.deleteUser = (req, res) => {
  const data = req.params;
  if (data === undefined || data.length === 0) {
    res.status(400).send('Es wurden keine Daten gesendet');
    return;
  }
  User.findById(data.userId, (err, user) => {
    if (err) res.status(400).send('User konnte nicht gefunden werden');
    else {
      for (let i = 0; i < user.groups.length; i += 1) {
        Group.update({ _id: user.groups[i] },
          { $pull: { users: data.userId } }, (er) => {
            if (er) res.status(400).send('User Hier nicht gefunden');
          });
      }
    }
  });
  User.findByIdAndRemove(data.userId, (err) => {
    if (err) {
      res.status(400).send('Nutzer konnte nicht gelöscht werden');
    } else res.status(200).send('Nutzer erfolgreich gelöscht');
  });
};

// Login User
module.exports.loginUser = (req, res) => {
  const data = req.body;
  const hashedPassword = data.password;

  User.findOne({ email: data.email, password: hashedPassword }, (err, user) => {
    if (err) {
      res.status(400).send('Es ist ein Fehler aufgetreten');
    }
    res.status(200).send(user._id);
  });
};

// Empty Database (only for testing and demonstration)
module.exports.emptyDb = (req, res) => {
  User.remove({}, (err) => {
    if (err) winston.log('error', err);
  });
  Group.remove({}, (err) => {
    if (err) winston.log('error', err);
  });
  Event.remove({}, (err) => {
    if (err) winston.log('error', err);
  });

  res.send('done eptying');
};

// Fill Database (only for testing and demonstration)
module.exports.fillDb = (req, res) => {
  const newUser1 = new User({
    name: 'Jimmy Changa',
    email: 'jim@fmx.de',
    description: 'Ein Mitstudent von Benni',
    password: 'test1234',
    image: 'userImage/avatar.jpeg',
    groups: [],
    possibleEvents: [],
    activeEvents: [],
  });
  newUser1.save((err) => {
    if (err) return winston.log('error', err);
    return null;
  });

  const newUser2 = new User({
    name: 'Benni Babel',
    email: 'benni@googelmail.com',
    description: 'Ein ganz normaler HdM-Student',
    password: 'test1234',
    image: 'userImage/avatar.jpeg',
    groups: [],
    possibleEvents: [],
    activeEvents: [],
  });
  newUser2.save((err) => {
    if (err) winston.log('error', (err));
    return null;
  });

  const newUser3 = new User({
    name: 'Hannes Hammann',
    email: 'hannes@jahu.com',
    description: 'Bennis Bruder',
    image: 'userImage/avatar.jpeg',
    password: '$',
    groups: [],
    possibleEvents: [],
    activeEvents: [],
  });
  newUser3.save((err) => {
    if (err) return winston.log('error', err);
    return null;
  });

  const newGroup1 = new Group({
    name: 'Familie',
    description: 'Verwandte',
    image: 'file.png',
    users: [newUser2._id.toString(), newUser3._id.toString()],
    events: [],
  });
  newGroup1.save((err) => {
    if (err) winston.log('error', err);
  });

  const newGroup2 = new Group({
    name: 'HdM-Freunde',
    description: 'Alle Freunde an der HdM',
    image: 'anotherFile.png',
    users: [newUser2._id.toString(), newUser1._id.toString()],
    events: [],
  });
  newGroup2.save((err) => {
    if (err) winston.log('error', err);
  });

  const newGroup3 = new Group({
    name: 'Mobile Web Application',
    description: 'Sehr spannende Veranstaltung',
    image: 'anotherFile.png',
    users: [newUser3._id.toString()],
    events: [],
  });
  newGroup3.save((err) => {
    if (err) winston.log('error', err);
  });

  const newEvent1 = new Event({
    name: 'MediaNight',
    description: 'Tolle Veranstaltung',
    location: 'An der HdM',
    date: new Date('2017-06-29T19:00:00.000Z'),
    groups: [newGroup2._id.toString()],
  });
  newEvent1.save((err) => {
    if (err) winston.log('error', err);
  });

  const newEvent2 = new Event({
    name: 'Opas Geburtstag',
    description: 'Alle Jahre wieder',
    location: 'Gasthaus Alte Linde',
    date: new Date('2017-07-11T14:00:00.000Z'),
    groups: [newGroup1._id.toString()],
  });
  newEvent2.save((err) => {
    if (err) winston.log('error', err);
  });

  const newEvent3 = new Event({
    name: 'Freibad',
    description: 'Im Sommer gehts ins Freibad',
    location: 'Freibad Vaihingen',
    date: new Date('2017-07-10T09:40:00.000Z'),
    groups: [newGroup1._id.toString(), newGroup2._id.toString()],
  });
  newEvent3.save((err) => {
    if (err) winston.log('error', err);
  });

  newUser1.groups.push(newGroup2._id.toString());
  newUser2.groups.push(newGroup1._id.toString());
  newUser2.groups.push(newGroup2._id.toString());
  newUser3.groups.push(newGroup1._id.toString());

  newGroup1.events.push(newEvent2._id.toString());
  newGroup1.events.push(newEvent3._id.toString());
  newGroup2.events.push(newEvent1._id.toString());
  newGroup2.events.push(newEvent3._id.toString());

  newUser1.possibleEvents.push(newEvent1._id.toString());
  newUser1.possibleEvents.push(newEvent3._id.toString());
  newUser2.possibleEvents.push(newEvent1._id.toString());
  newUser2.possibleEvents.push(newEvent2._id.toString());
  newUser2.possibleEvents.push(newEvent3._id.toString());
  newUser3.possibleEvents.push(newEvent2._id.toString());
  newUser3.possibleEvents.push(newEvent3._id.toString());
  res.send('done filling');
};
