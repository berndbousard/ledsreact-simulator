const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  name: {
    type: String,
    required: true
  },

  desc: {
    type: String,
    required: true
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: `User`,
    required: true
  },

  targetAge: {
    type: Number,
    required: true
  },

  intensity: {
    type: Number,
    required: true
  },

  groupSize: {
    type: Number,
    required: true
  },

  focus: {
    type: String,
    required: true
  },

  sport: {
    type: Schema.Types.ObjectId,
    ref: `Sport`,
    required: true
  },

  image: {
    type: String,
    default: `exercisePic.jpg`,
    required: true
  },

  sharedWithPublic: {
    type: String,
    default: false
  },

  sharedWithTeam: {
    type: String,
    default: false
  },

  price: {
    type: Number,
    default: 0
  },

  created: {
    type: Date,
    default: Date.now()
  }
});

// Om te kunnen hashen
// bcrypt zal zelfde ww ook anders encrypteren
// Zelf als je edit zal het nog steeds geencryteerd zijn
// schema.plugin(require(`mongoose-bcrypt`));

module.exports = {schema};
