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
        maxBytes: 5000000, // 1MB
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
          targetAge: Joi.string().required(),
          intensity: Joi.number().required(),
          groupSize: Joi.string().required(),
          focus: Joi.string().required(),
          sport: Joi.objectId().required(),
          image: Joi.any().required(),
          imageWithDirections: Joi.any().required(),
          feedback: Joi.object()
        }
      }

    },
    handler: (req, res) => {

      //-------------------------------{Image 1}---------------------------------
      const image = req.payload.image;
      const imageName = Math.random().toString(36).substr(2, 12);
      const imageUploadLocation = nodePath.join(__dirname, `/../../uploads`, `${imageName}.png`);

      const imageFile = fs.createWriteStream(imageUploadLocation);

      imageFile.on(`error`, e => res(Boom.badRequest(e.errmsg ? e.errmsg : e)));

      image.pipe(imageFile);
      image.on(`end`, e => {
        if (e) {
          return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
        }
      });

      //-------------------------------{Image 2}---------------------------------
      const imageWithDirections = req.payload.imageWithDirections;
      const imageWithDirectionsName = Math.random().toString(36).substr(2, 12);
      const imageWithDirectionsUploadLocation = nodePath.join(__dirname, `/../../uploads`, `${imageWithDirectionsName}.png`);

      const imageWithDirectionsFile = fs.createWriteStream(imageWithDirectionsUploadLocation);

      imageWithDirectionsFile.on(`error`, e => res(Boom.badRequest(e.errmsg ? e.errmsg : e)));

      imageWithDirections.pipe(imageWithDirectionsFile);

      imageWithDirections.on(`end`, e => {
        if (e) {
          return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
        }
      });


      //-------------------------------{Opslaan}---------------------------------
      const data = pick(req.payload, [`name`, `desc`, `creator`, `targetAge`, `intensity`, `groupSize`, `focus`, `sport`, `feedback`]);
      data.image = imageName;
      data.imageWithDirections = imageWithDirectionsName;
      const exercise = new Exercise(data);
      // const projection = [`__v`];

      exercise.save()
        .then(r => {
          // r = omit(r.toJSON(), projection);
          return res({exercise: {_id: r._id}});
        })
        .catch(e => {
          return res(Boom.badRequest(e.errmsg ? e.errmsg : e));
        });
    }
  }
];
