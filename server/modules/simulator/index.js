module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  let directions = [];

  io.on(`connection`, socket => {

    const {id: socketId} = socket;
    const {client} = socket.handshake.query;

    if (client === `app`) {
      console.log(`App is verbonden`);
    }

    if (client === `direction`) {
      const direction = {
        socketId,
        batteryLevel: Math.round(Math.random() * 100),
        function: `richting`
      };

      io.to(direction.socketId).emit(`initDirection`, {direction});

      directions.push(direction);

      console.log(`Direction met Id ${direction.socketId} is verbonden`);

      socket.broadcast.emit(`directionJoined`, direction);
    }

    console.log(`---`);
    console.log(directions);
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

    socket.on(`disconnect`, () => {
      if (client === `direction`) {
        console.log(`Direction met als ID ${socketId} is weg`);
        directions = directions.filter(f => {
          return f.socketId !== socketId;
        });
      }
      console.log(`disconnect`);

      if (client === `app`) {
        console.log(`App is weg`);
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
