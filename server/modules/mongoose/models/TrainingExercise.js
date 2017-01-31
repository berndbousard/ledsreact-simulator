const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: `Exercise`,
    required: true
  },

  training: {
    type: Schema.Types.ObjectId,
    ref: `Training`,
    required: true
  },

  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {schema};
