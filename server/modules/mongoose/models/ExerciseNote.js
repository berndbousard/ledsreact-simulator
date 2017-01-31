const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: `Exercise`,
    required: true
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: `User`,
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
