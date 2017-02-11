const {ExerciseFeedback, Exercise} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/exerciseFeedback`;

module.exports = [

// GET
  {
    method: `GET`,
    path: `${path}/{_id?}`,
    config: {

      auth: {
        strategy: `token`,
        scope: [Scopes.USER]
      },

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
        ExerciseFeedback.findOne({_id: `${_id}`}, projection)
          .populate({
            path: `creator`,
            select: `name _id image`,
          })
          .then(r => {
            return res({exerciseFeedback: r});
          })
          .catch(e => {
            return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
          });
      }

      else {
        ExerciseFeedback.find({}, projection)
          .populate({
            path: `creator`,
            select: `name _id image`,
          })
          .then(r => {
            return res({exerciseFeedback: r});
          })
          .catch(e => {
            return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
          });
      }

    }
  },


// POST
  {
    method: `POST`,
    path: `${path}`,
    config: {

      auth: {
        strategy: `token`,
        scope: [Scopes.USER]
      },

      validate: {

        options: {
          abortEarly: false
        },

        payload: {
          creator: Joi.objectId().required(),
          exercise: Joi.objectId().required(),
          text: Joi.string().required()
        }
      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`creator`, `exercise`, `text`]);
      const exerciseFeedback = new ExerciseFeedback(data);
      const projection = [`__v`, `created`];

      exerciseFeedback.save()
        .then(r => {
          r = omit(r.toJSON(), projection);
          return r;
        })
        .then(r => {
          console.log(r._id);
          Exercise.update({_id: r.exercise}, {$addToSet: {feedback: r._id}})
            .then((_r => {
              console.log(_r);
              return res({exerciseFeedback: r});
            }))
            .catch(e => {
              return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
            });
        })
        .catch(e => {
          return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
        });
    }
  }
];
