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

  sport: {
    type: Schema.Types.ObjectId,
    ref: `Sport`,
    required: true
  },

  team: {
    type: Schema.Types.ObjectId,
    ref: `Team`,
    required: true
  },

  type: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    default: `propic.jpg`
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
