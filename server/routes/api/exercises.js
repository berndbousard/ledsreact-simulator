const {Exercise} = require(`mongoose`).models;

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

// handig wanneer je comments van specifieke user.
// moet aan specifiek patroon voldoen
const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/exercises`;

module.exports = [

// GET
  {
    method: `GET`,
    path: `${path}/{_id?}`,
    config: {
      validate: {
        options: {
          abortEarly: false
        },

        params: {
          _id: Joi.objectId()
        }
      }
    },
    handler: (req, res) => {

      const {_id} = req.params;
      const projection = `-__v`;

      if (_id) {
        Exercise.findOne({_id: `${_id}`}, projection)
          .populate(`creator`)
          .exec()
          .then(r => {
            return res({r});
          })
          .catch(() => {
            return res(Boom.badRequest());
          });
      }

      else {
        Exercise.find()
          .populate(`creator`)
          .exec()
          .then(r => {
            return res({r});
          })
          .catch(() => {
            return res(Boom.badRequest());
          });
      }

    }
  },


// POST
  {
    method: `POST`,
    path: `${path}`,
    config: {
      validate: {
        options: {
          abortEarly: false
        },
        payload: {
          name: Joi.string().required(),
          desc: Joi.string().required(),
          creator: Joi.objectId().required()
        }
      }
    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`, `desc`, `creator`]);
      const exercise = new Exercise(data);

      exercise.save()
        .then(r => {
          return res({r});
        })
        .catch(() => {
          return res(Boom.badRequest(`Cannot save user`));
        });
    }
  }
];
