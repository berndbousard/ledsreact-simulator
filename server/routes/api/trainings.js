const {Training} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/trainings`;

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
        Training.findOne({_id: `${_id}`}, projection)
          .populate(`creator`)
          .then(r => {
            return res({r});
          })
          .catch(() => {
            return res(Boom.badRequest());
          });
      }

      else {
        Training.find()
          .populate({
            path: `creator`,
            select: `-__v -password`,
          })
          .then(r => {
            const projection = [`__v`];
            r = r.map((_r => {
              return omit(_r.toJSON(), projection);
            }));
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

      auth: {
        strategy: `token`,
        scope: [Scopes.USER]
      },

      validate: {

        options: {
          abortEarly: false
        },

        payload: {
          name: Joi.string().required(),
          scheduleDay: Joi.date().required(),
          timeframe: Joi.number().required(),
          creator: Joi.objectId().required()
        }

      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`, `scheduleDay`, `timeframe`, `creator`]);
      const training = new Training(data);
      const projection = [`__v`];

      training.save()
        .then(r => {
          r = omit(r.toJSON(), projection);
          return res({r});
        })
        .catch(e => {
          return res(Boom.badRequest(e.errmsg));
        });
    }
  }
];
