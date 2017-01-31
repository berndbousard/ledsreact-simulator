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
          .catch(e => {
            return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
          });
      }

      else {
        User.find(projection)
          .populate({
            path: `sport`,
            select: `-__v`,
          })
          .populate({
            path: `team`,
            select: `-__v`,
          })
          .then(r => {
            const projection = [`__v`];
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

      // auth: {
      //   strategy: `token`,
      //   mode: `try`
      // },

      validate: {

        options: {
          abortEarly: false
        },

        payload: {
          name: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
          type: Joi.number().required(),
          sport: Joi.objectId().required(),
          team: Joi.objectId().required()
        }
      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`, `email`, `password`, `sport`, `team`, `type`, `image`, `scope`, `isActive`, `created`]);
      const user = new User(data);
      const projection = [`__v`, `password`, `isActive`];

      user.save()
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
