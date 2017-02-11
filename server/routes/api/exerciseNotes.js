const {ExerciseNote, Exercise} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/exerciseNotes`;

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
        ExerciseNote.findOne({_id: `${_id}`}, projection)
          .populate({
            path: `exercise`,
            select: `-__v`,
          })
          .populate({
            path: `creator`,
            select: `-__v -password`,
          })
          .then(r => {
            return res({r});
          })
          .catch(e => {
            return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
          });
      }

      else {
        ExerciseNote.find()
          .populate({
            path: `exercise`,
            select: `-__v`,
          })
          .populate({
            path: `creator`,
            select: `-__v -password`,
          })
          .then(r => {
            const projection = [`__v`, `created`];
            r = r.map((_r => {
              return omit(_r.toJSON(), projection);
            }));
            return res({r});
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
          exercise: Joi.objectId().required(),
          creator: Joi.objectId().required(),
          text: Joi.string().required()
        }

      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`exercise`, `creator`, `text`]);
      const exerciseNote = new ExerciseNote(data);
      const projection = [`__v`, `created`];

      exerciseNote.save()
        .then(r => {
          r = omit(r.toJSON(), projection);
          return r;
        })
        .then(r => {
          Exercise.update({_id: r.exercise}, {$addToSet: {notes: r._id}})
            .then((_r => {
              console.log(_r);
              return res({exerciseNotes: r});
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
