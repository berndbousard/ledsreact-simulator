
const schema = new Schema ({
  name: {
    type: String,
    required: true
  },

  data: {
    type: Object,
    required: true
  }

  data: {
  //   top: {
  //     color: {
  //       type: String
  //     },
  //
  //     delay: {
  //       type: String
  //     }
  //   },
  //
  //   bottom: {
  //     color: {
  //       type: String
  //     },
  //
  //     delay: {
  //       type: String
  //     }
  //   },
  //
  //   left: {
  //     color: {
  //       type: String
  //     },
  //
  //     delay: {
  //       type: String
  //     }
  //   },
  //
  //   right: {
  //     color: {
  //       type: String
  //     },
  //
  //     delay: {
  //       type: String
  //     }
  //   },
  // }

  created: {
    type: Date,
    default: Date.now()
  }
});
