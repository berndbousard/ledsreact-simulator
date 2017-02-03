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

  creator: {
    type: Schema.Types.ObjectId,
    ref: `User`,
    required: true
  },

  targetAge: {
    type: Number,
    required: true
  },

  intensity: {
    type: Number,
    required: true
  },

  groupSize: {
    type: Number,
    required: true
  },

  focus: {
    type: String,
    required: true
  },

  sport: {
    type: Schema.Types.ObjectId,
    ref: `Sport`,
    required: true
  },

  image: {
    type: String,
    required: true,
    unique: true
  },

  // feedback: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId,
  //       ref: `User`
  //     },
  //
  //     text: {
  //       type: String
  //     }
  //   }
  // ],

  feedback: [
    {
      type: Schema.Types.ObjectId,
      ref: `ExerciseFeedback`
    }
  ],

  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: `ExerciseNote`
    }
  ],

  public: {
    type: Boolean,
    default: false
  },

  price: {
    type: Number,
    default: 0
  },

  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = {schema};
