const Schema = require(`mongoose`).Schema;

const Scopes = require(`../const/Scopes`);

const schema = new Schema ({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
    bcrypt: true
  },

  scope: {
    type: String,
    default: Scopes.USER
  },

  isActive: {
    type: Boolean,
    default: true
  },

  created: {
    type: Date,
    default: Date.now()
  }

});

schema.plugin(require(`mongoose-bcrypt`));

module.exports = {schema};
