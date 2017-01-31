const Schema = require(`mongoose`).Schema;

const schema = new Schema ({

  name: {
    type: String,
    required: true,
    unique: true
  },

  imageName: {
    type: String,
    required: true,
    unique: true
  },

  created: {
    type: Date,
    default: Date.now()
  }

});

module.exports = {schema};
