
const {User} = require(`mongoose`).models;

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

// handig wanneer je comments van specifieke user.
// moet aan specifiek patroon voldoen
const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/users`;

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
      validate: {
        options: {
          abortEarly: false
        },
        payload: {
          name: Joi.string().required(),
          email: Joi.string().required()
        }
      }
    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`, `email`]);
      const user = new User(data);

      user.save()
        .then(r => {
          return res({r});
        })
        .catch(() => {
          return res(Boom.badRequest(`Cannot save user`));
        });
    }
  }
];
