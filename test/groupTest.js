/* global mocha-describe describe:true*/
/* global mocha-it it:true*/
const Group = require('../models/groups');
const mongoose = require('mongoose');
const expect = require('chai').expect;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://db:27017/users');

let testGroup;

describe('Test POST Group', () => {
  it('test should create a group called Fussballmannschaft', (done) => {
    const newGroup = new Group({
      name: 'Fussballmannschaft',
    });
    newGroup.save((err) => {
      if (err) console.error(err);
    });
    done();
    testGroup = newGroup;
    expect(testGroup).not.to.equal(null);
  });
});

describe('Test GET Groups', () => {
  it('test should return an array', (done) => {
    Group.find((err, groups) => {
      expect(groups).to.be.an('array');
      done();
      return null;
    });
  });

  it('tested groups name should be Fussballmannschaft', (done) => {
    expect(testGroup.name).to.equal('Fussballmannschaft');
    done();
  });
});
describe('Test PUT Group', () => {
  it('tested groups description should  be FC Stuttgart', (done) => {
    testGroup.description = 'FC Stuttgart';
    expect(testGroup.description).to.equal('FC Stuttgart');
    done();
  });
});

describe('Test DELETE Group', () => {
  it('test should delete a group called Fussballmannschaft', (done) => {
    Group.findOne({ name: 'Fussballmannschaft' }, (err, group) => {
      if (err) console.error(err);
      group.remove();
      done();
      Group.findOne({ name: 'Fussballmannschaft' }, (error, oldGroup) => {
        if (error) console.error(error);
        expect(oldGroup).to.equall(null);
      });
    });
  });
});
