var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  admin: {
    type: Boolean,
    default: false
  }, 
  password: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true,
    
  },
  nom: {
    type: String,
    required: true,
    
  },
  affichage: {
    type: Boolean,
    default: "false"
  },
  mail: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 2
  },
  filiere: {
    type: String
  },
  dev: {
    type: Array,
    default: []
  },
  design: {
    type: Array,
    default: []
  },
  com: {
    type: Array,
    default: []
  },
  tags: {
    type: Array
  },
  parcours: {
    type: Array
  },
  description: {
    type: String
  },
  biographie: {
    type: String
  },
  disponibilites: {
    type: String
  },
  realisations: {
    dribbble: String,
    behance: String,
    instagram: String,
    site: String
  },
  contact: {
    linkedin: String,
    facebook: String,
    telephone: String
  },
  photo: {
    type: String
  },
  profil: {
    type: String
  },  
  competences: {
    com: String,
    dev: String,
    design: String
  },
  imgURL: {
    type: String
  }
});

UserSchema.statics.authenticate = function (mail, password, callback) {
  User.findOne({ mail: mail })
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