const Schema = require(`mongoose`).Schema;

const schema = new Schema ({
  x: {
    type: Number,
    required: true
  },

  y: {
    type: Number,
    required: true
  },

  exercise: {
    type: Schema.Types.ObjectId,
    ref: `Exercise`,
    required: true
  },

  delay: {
    type: Number,
    required: true
  },

  combineLights: {
    type: Boolean,
    required: true
  },

  directions: {
    top: {
      colors: Array
    },

    bottom: {
      colors: Array
    },

    left: {
      colors: Array
    },

    right: {
      colors: Array
    }
  },

  created: {
    type: Date,
    default: Date.now()
  }

});

module.exports = {schema};
