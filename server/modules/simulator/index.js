module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  let directions = [];
  let fields = [];

  io.on(`connection`, socket => {

    const {id: socketId} = socket;
    const {client} = socket.handshake.query;

    if (client === `app`) {
      console.log(`App is verbonden`);
    }

    if (client === `field`) {
      console.log(`field is verbonden`);

      const field = {
        socketId
      };

      fields.push(field);
    }

    if (client === `direction`) {
      const direction = {
        socketId,
        batteryLevel: Math.round(Math.random() * 100),
        x: 0, y: 0
      };

      io.to(direction.socketId).emit(`initDirection`, {direction});

      directions.push(direction);

      console.log(`Direction met Id ${direction.socketId} is verbonden`);

      socket.broadcast.emit(`directionJoined`, direction);
    }

    console.log(`--Directions--`);
    console.log(directions);
    console.log(`----`);

    console.log(`--fields--`);
    console.log(fields);
    console.log(`----`);

    socket.emit(`init`, directions);

    //-------------------------------{Direction oplichten als je erop tikt}---------------------------------
    socket.on(`lightUpDirection`, socketId => {

      const direction = directions.filter(d => {
        return d.socketId === socketId;
      });

      if (!direction) {
        console.log(`Geen Direction verbonden met deze socket id`);
        return;
      }

      io.to(socketId).emit(`lightUp`);

      fields.forEach(f => {
        console.log(`overlopen`);
        io.to(f.socketId).emit(`lightUpDirection`, socketId);
      });
    });

    socket.on(`changeDirectionFunction`, ({func, order}) => {
      console.log(func, order);
    });

    socket.on(`checkDirections`, () => {
      socket.emit(`checkDirections`, directions);
    });

    socket.on(`updateDirectionsFunction`, ({functions}) => {
      directions = directions.map((d, index) => {
        d.function = functions[index];
        io.to(d.socketId).emit(`changeFunction`, {function: functions[index]});
        return d;
      });
    });



    socket.on(`setDirectionSettings`, directionSettings => {
      // console.log(`directionsettings`, directionSettings);
      // directions = directions.map((d, index) => {
      //   if (index < directionSettings.length) {
      //     d.settings = directionSettings[index];
      //     return d;
      //   }
      // });

      console.log(`directionSettings`, directionSettings);

      fields = fields.map(f => {
        io.to(f.socketId).emit(`changeDirections`, directionSettings);
        return f;
      });
    });


    socket.on(`nextStep`, () => {

      console.log(`nextStep`);

      fields = fields.map(f => {
        io.to(f.socketId).emit(`nexStep`);
        return f;
      });
    });


    socket.on(`stopExcersize`, () => {

      fields = fields.map(f => {
        io.to(f.socketId).emit(`stopExcersize`);
        return f;
      });
    });







    socket.on(`disconnect`, () => {

      console.log(`disconnect`);

      if (client === `direction`) {
        console.log(`Direction met als ID ${socketId} is weg`);
        directions = directions.filter(f => {
          return f.socketId !== socketId;
        });
      }

      if (client === `app`) {
        console.log(`App is weg`);
      }

      if (client === `field`) {
        fields = fields.filter(f => {
          return f.socketId !== socketId;
        });
      }

      socket.broadcast.emit(`updateDirections`, socketId);
    });
  });

  next();
};

module.exports.register.attributes = {
  name: `simulator`,
  version: `0.1.0`
};
