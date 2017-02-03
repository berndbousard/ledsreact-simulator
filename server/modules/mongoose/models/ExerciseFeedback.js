const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  creator: {
    type: Schema.Types.ObjectId,
    ref: `User`,
    required: true
  },

  exercise: {
    type: Schema.Types.ObjectId,
    ref: `Exercise`,
    required: true
  },

  text: {
    type: String,
    required: true
  },

  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {schema};
