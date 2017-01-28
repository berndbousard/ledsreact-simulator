const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  }
});

// Om te kunnen hashen
// bcrypt zal zelfde ww ook anders encrypteren
// Zelf als je edit zal het nog steeds geencryteerd zijn
// schema.plugin(require(`mongoose-bcrypt`));

module.exports = {schema};
