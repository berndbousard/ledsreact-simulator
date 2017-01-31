const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  exercise: {
    type: Schema.Types.ObjectId,
    ref: `Exercise`,
    required: true
  },

  function: {
    type: Schema.Types.ObjectId,
    ref: `DirectionFunction`,
    required: true
  },

  order: {
    type: Number,
    required: true
  },

  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {schema};
