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

  price: {
    type: Number,
    required: true
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: `User`,
    required: true
  },

  creatorBio: {
    type: String,
    required: true
  },

  club: {
    type: String,
    required: true
  },

  clubImage: {
    type: String,
    default: `clubPic.jpg`
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
