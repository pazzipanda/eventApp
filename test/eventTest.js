/* global mocha-describe describe:true*/
/* global mocha-it it:true*/
const Event = require('../models/events');
const mongoose = require('mongoose');
const expect = require('chai').expect;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://db:27017/users');

let testEvent;

describe('Test POST Event', () => {
  it('test should create an event called Semesterstart', (done) => {
    const newEvent = new Event({
      name: 'Semesterstart',
    });
    testEvent = newEvent;
    newEvent.save((err) => {
      if (err) console.error(err);
    });
    done();
    expect(testEvent).not.to.equal(null);
  });
});

describe('Test GET Events', () => {
  it('test should return an array', (done) => {
    Event.find((err, events) => {
      expect(events).to.be.an('array');
      done();
      return null;
    });
  });
  it('tested events name should be Semesterstart', (done) => {
    expect(testEvent.name).to.equal('Semesterstart');
    done();
  });
});

describe('Test PUT Event', () => {
  it('tested events location be An der HdM anymore', (done) => {
    testEvent.location = 'An der HdM';
    expect(testEvent.location).to.equal('An der HdM');
    done();
  });
});
describe('Test DELETE Event', () => {
  it('test should delete an event called Semesterstart', (done) => {
    Event.findOne({ name: 'Semesterstart' }, (err, event) => {
      if (err) console.error(err);
      event.remove();
      done();
      Event.findOne({ name: 'Semesterstart' }, (error, oldEvent) => {
        if (error) console.error(error);
        expect(oldEvent).to.equal(null);
      });
    });
  });
});
