const {PackageExercise} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/packageExercises`;

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
        PackageExercise.findOne({_id: `${_id}`}, projection)
          .populate({
            path: `team`,
            select: `-__v -created`,
          })
          .then(r => {
            return res({r});
          })
          .catch(e => {
            return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
          });
      }

      else {
        PackageExercise.find()
          .populate({
            path: `team`,
            select: `-__v -created`,
          })
          .populate({
            path: `exercise`,
            select: `-__v`,
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
          team: Joi.objectId().required()
        }

      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`team`, `exercise`]);
      const packageExercise = new PackageExercise(data);
      const projection = [`__v`, `created`];

      packageExercise.save()
        .then(r => {
          r = omit(r.toJSON(), projection);
          return res({r});
        })
        .catch(e => {
          return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
        });
    }
  }
];
