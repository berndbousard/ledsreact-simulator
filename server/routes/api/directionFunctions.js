const {DirectionFunction} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/directionFunctions`;

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
        DirectionFunction.findOne({_id: `${_id}`}, projection)
          .then(r => {
            return res({r});
          })
          .catch(e => {
            return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
          });
      }

      else {
        DirectionFunction.find()
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
          name: Joi.string().required()
        }

      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`]);
      const directionFunction = new DirectionFunction(data);
      const projection = [`__v`, `created`];

      directionFunction.save()
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
