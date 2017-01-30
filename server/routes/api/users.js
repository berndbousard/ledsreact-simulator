const {User} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

const {pick, omit} = require(`lodash`); // dingen uit object halen met pick; omit om dingen uit object te smijten

const Boom = require(`boom`);
const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/users`;

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
        User.findOne({_id: `${_id}`}, projection)
          .then(r => {
            return res({r});
          })
          .catch(() => {
            return res(Boom.badRequest());
          });
      }

      else {
        User.find()
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

      auth: {
        strategy: `token`,
        mode: `try`
      },

      validate: {

        options: {
          abortEarly: false
        },

        payload: {
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required()
        }
      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`, `email`, `password`, `scope`, `created`]);
      const user = new User(data);
      const projection = [`__v`, `password`, `isActive`];

      user.save()
        .then(r => {
          r = omit(r.toJSON(), projection);
          return res({r});
        })
        .catch(() => {
          return res(Boom.badRequest(`Cannot save user`));
        });
    }
  }
];
