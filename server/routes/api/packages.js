const {Package} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/packages`;

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
        Package.findOne({_id: `${_id}`}, projection)
          .then(r => {
            return res({r});
          })
          .catch(() => {
            return res(Boom.badRequest());
          });
      }

      else {
        Package.find()
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
          desc: Joi.string().required(),
          price: Joi.number().required(),
          creator: Joi.objectId().required(),
          creatorBio: Joi.string().required(),
          club: Joi.string().required()
        }

      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`, `desc`, `price`, `creator`, `creatorBio`, `club`]);
      const _package = new Package(data);
      const projection = [`__v`];

      _package.save()
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
