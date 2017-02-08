const {Direction} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit, isEmpty} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/directions`;

module.exports = [

// GET
  {
    method: `GET`,
    path: `${path}/{_id?}`,
    config: {

      // auth: {
      //   strategy: `token`,
      //   scope: [Scopes.USER]
      // },

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
      const {exercise} = req.query;
      const query = {};
      const projection = `-__v`;

      if (!isEmpty(_id)) {
        query._id = _id;
      }

      if (!isEmpty(exercise)) {
        query.exercise = exercise;
      }

      if (_id) {
        Direction.findOne(query, projection)
          .populate({
            path: `function`,
            select: `name`
          })
          .then(r => {
            return res({r});
          })
          .catch(e => {
            return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
          });
      }

      else {
        Direction.find(query)
          .populate({
            path: `function`,
            select: `name`
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
      //   scope: [Scopes.USER]
      // },

      validate: {

        options: {
          abortEarly: false
        },

        payload: {
          x: Joi.number().required(),
          y: Joi.number().required(),
          exercise: Joi.objectId().required(),
          combineLights: Joi.boolean().required(),
          delay: Joi.number().required(),
          directions: Joi.object({
            top: Joi.object(),
            bottom: Joi.object(),
            left: Joi.object(),
            right: Joi.object()
          }).required()
        }

      }

    },
    handler: (req, res) => {
      const data = pick(req.payload, [`x`, `y`, `exercise`, `delay`, `combineLights`, `directions`]);
      const direction = new Direction(data);
      const projection = [`__v`];

      direction.save()
        .then(r => {
          r = omit(r.toJSON(), projection);
          return res({direction: r});
        })
        .catch(e => {
          return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
        });
    }
  }
];
