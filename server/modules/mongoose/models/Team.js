const Schema = require(`mongoose`).Schema;

const schema = new Schema ({

  name: {
    type: String,
    required: true
  },

  sport: {
    type: Schema.Types.ObjectId,
    ref: `Sport`,
    required: true
  },

  created: {
    type: Date,
    default: Date.now()
  }

});

module.exports = {schema};
