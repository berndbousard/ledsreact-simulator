const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: `Exercise`,
    required: true
  },

  team: {
    type: Schema.Types.ObjectId,
    ref: `Team`,
    required: true
  },

  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {schema};
