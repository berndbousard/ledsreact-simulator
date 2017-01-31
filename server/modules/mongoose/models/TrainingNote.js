const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  training: {
    type: Schema.Types.ObjectId,
    ref: `Training`,
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
