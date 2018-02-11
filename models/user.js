var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false
  }, 
  affichage: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
  },
  fillière: {
    type: String
  },
  competences: {
    type: Array,
  },
  tags: {
    type: Array,
  },
  parcours: {
    type: Array,
  },
  biographie: {
    type: String,
  },
  disponibilites: {
    type: String,
  },
  realisation: {
    type: Array,
  },
  contact: {
    type: Array,
  }
});

UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('Utilisateur inconnu.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('user', UserSchema);
module.exports = User;