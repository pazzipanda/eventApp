/* global mocha-describe describe:true*/
/* global mocha-it it:true*/
const User = require('../models/user');
const mongoose = require('mongoose');
const expect = require('chai').expect;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://db:27017/users');

let testUser;

describe('Test POST User', () => {
  it('test should create an user called Mike', (done) => {
    const newUser = new User({
      name: 'Mike',
    });
    newUser.save((err) => {
      if (err) console.error(err);
    });
    done();
    testUser = newUser;
    expect(testUser).not.to.equal(null);
  });
});

describe('Test GET User', () => {
  it('test should return an array', (done) => {
    User.find((err, users) => {
      expect(users).to.be.an('array');
      done();
      return null;
    });
  });

  it('tested user name should be Mike', (done) => {
    expect(testUser.name).to.equal('Mike');
    done();
  });
});

describe('Test PUT User', () => {
  it('tested user email should be mike@jmail.de anymore', (done) => {
    testUser.email = 'mike@jmail.de';
    expect(testUser.email).to.equal('mike@jmail.de');
    done();
  });
});


describe('Test DELETE User', () => {
  it('test should delete an user called Mike', (done) => {
    User.findOne({ name: 'Mike' }, (err, user) => {
      if (err) console.error(err);
      user.remove();
      done();
      User.findOne({ name: 'Mike' }, (error, oldUser) => {
        if (error) console.error(error);
        expect(oldUser).to.equall(null);
      });
    });
  });
});
