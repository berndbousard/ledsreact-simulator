
const {Test} = require(`mongoose`).models;

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit} = require(`lodash`);

const Boom = require(`boom`);

// handig wanneer je comments van specifieke user.
// moet aan specifiek patroon voldoen
const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/tests`;

module.exports = [

// GET
  {
    method: `GET`,
    path: `${path}`,
    config: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    handler: (req, res) => {
      Test.find()
        .then(tests => {
          return res({tests});
        })
        .catch(() => {
          return res(Boom.badRequest());
        });
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
          description: Joi.string().required()
        }
      }
    },
    handler: (req, res) => {
      const data = pick(req.payload, [`name`, `description`]);
      const test = new Test(data);

      test.save()
        .then(t => {
          return res({t});
        })
        .catch(() => {
          return res(Boom.badRequest(`Cannot save user`));
        });
    }
  }
];
