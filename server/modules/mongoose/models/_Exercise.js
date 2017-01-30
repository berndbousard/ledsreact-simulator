const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: true
  },

  directionLocations: {
    type: Array,
    required: true
  },

  directionAmount: {
    type: Number,
    required: true
  },

  sport: {
    type: String,
    required: true
  },

  focus: {
    type: String,
    required: true
  },

  playerAmount: {
    type: Number,
    required: true
  },

  difficulty: {
    type: Number,
    required: true
  },

  created: {
    type: Date,
    default: Date.now
  },
});

// Om te kunnen hashen
// bcrypt zal zelfde ww ook anders encrypteren
// Zelf als je edit zal het nog steeds geencryteerd zijn
// schema.plugin(require(`mongoose-bcrypt`));

module.exports = {schema};
