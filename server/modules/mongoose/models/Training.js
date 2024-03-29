const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  name: {
    type: String,
    required: true
  },

  scheduleDay: {
    type: Date,
    required: true
  },

  timeframe: {
    type: Number,
    required: true
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: `User`,
    required: true
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
