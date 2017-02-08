const fs = require(`fs`);
const nodePath = require(`path`);
const {Exercise} = require(`mongoose`).models;
const Scopes = require(`../../modules/mongoose/const/Scopes`);

// dingen uit object halen met pick; omit om dingen uit object te smijten
const {pick, omit, isEmpty} = require(`lodash`);

const Boom = require(`boom`);

const Joi = require(`joi`);
Joi.objectId = require(`joi-objectid`)(Joi);

const path = `/api/exercises`;

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
      const query = {};
      const {creator} = req.query;

      if (!isEmpty(_id)) {
        query._id = _id;
      }

      if (!isEmpty(creator)) {
        query.creator = creator;
      }

      const projection = `-__v`;

      if (_id) {
        Exercise.findOne(query, projection)
          .populate({
            path: `creator`,
            select: `-__v -password`,
          })
          .populate({
            path: `sport`,
            select: `-__v -created`,
          })
          .then(r => {
            return res({exercise: r});
          })
          .catch(() => {
            return res(Boom.badRequest());
          });
      }

      else {
        Exercise.find(query)
          .populate({
            path: `creator`,
            select: `_id name image`,
          })
          .populate({
            path: `sport`,
            select: `-__v -created`,
          })
          .populate({
            path: `feedback`,
            select: `creator text created`,
          })
          .populate({
            path: `notes`,
            select: `creator text created`,
          })
          .then(r => {
            const projection = [`__v`];
            r = r.map((_r => {
              return omit(_r.toJSON(), projection);
            }));
            return res({exercises: r});
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

      payload: {
        maxBytes: 1000000, // 1MB
        output: `stream`,  // We need to pipe the filedata to another server
        parse: true,
        allow: `multipart/form-data`
      },

      // auth: {
      //   strategy: `token`,
      //   scope: [Scopes.USER]
      // },

      validate: {
        options: {
          abortEarly: false
        },

        payload: {
          name: Joi.string().required(),
          desc: Joi.string().required(),
          creator: Joi.objectId().required(),
          targetAge: Joi.number().required(),
          intensity: Joi.number().required(),
          groupSize: Joi.number().required(),
          focus: Joi.string().required(),
          sport: Joi.objectId().required(),
          image: Joi.any().required(),
          feedback: Joi.object()
        }
      }

    },
    handler: (req, res) => {

      const image = req.payload.image;
      const imageName = image.hapi.filename;
      const imageUploadLocation = nodePath.join(__dirname, `/../../uploads`, `${imageName}`);

      const imageFile = fs.createWriteStream(imageUploadLocation);

      // Andere volgorde

      imageFile.on(`error`, e => res(Boom.badRequest(e.errmsg ? e.errmsg : e)));

      image.pipe(imageFile);
      image.on(`end`, e => {
        if (e) res(Boom.badRequest(e.errmsg ? e.errmsg : e));
      });

      const data = pick(req.payload, [`name`, `desc`, `creator`, `targetAge`, `intensity`, `groupSize`, `focus`, `sport`, `feedback`]);
      data.image = imageName;
      const exercise = new Exercise(data);
      const projection = [`__v`];

      exercise.save()
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
