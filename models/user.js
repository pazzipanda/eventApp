const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    index: { unique: true },
  },
  description: String,
  password: String,
  image: String,
  groups: [],
  possibleEvents: [],
  activeEvents: [],
});

userSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

userSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.hash(user.password, null, null, (hashError, hash) => {
    if (hashError) { return next(hashError); }
    // replace a password string with hash value
    user.password = hash;
    return next();
  });
});

module.exports = mongoose.model('User', userSchema);
