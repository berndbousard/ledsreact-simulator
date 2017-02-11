import React, {Component} from 'react';
import io from 'socket.io-client';

import {Direction} from '../components';
let currentDirectionIndex = 0;


class Field extends Component {

  state = {
    directions: [],
    settings: []
  }



  ShowFaceHandler() {
    if (this.field) {
      if (this.cursor.style.backgroundImage === `url("../assets/kop1.png")`) {
        this.cursor.style.backgroundImage = `url("../assets/kop2.png")`;
      } else {
        this.cursor.style.backgroundImage = `url("../assets/kop1.png")`;
      }
    }
  }

  componentDidMount() {

    // code voor cursorshit, moet nog een image in gepropt worden

    document.addEventListener(`mousemove`, e => {
      this.cursor.style.display = `block`;
      this.cursor.style.left = `${e.clientX - (100 / 2)}px`;
      this.cursor.style.top = `${e.clientY - (160 / 2)}px`;
    });

    this.socket = io(`/`, {query: `client=field`});
    this.socket.on(`init`, directions => this.WSInitHandler(directions));
    this.socket.on(`updateDirections`, socketId => this.WSUpdateDirectionsHandler(socketId));
    this.socket.on(`directionJoined`, direction => this.WSDirectionJoinedHandler(direction));
    this.socket.on(`lightUpDirection`, directionLightTrigger => this.WSLightUpDirection(directionLightTrigger));
    this.socket.on(`changeDirections`, settings => this.WSSettingsDirectionsHandler(settings));
    this.socket.on(`nexStep`, () => this.WSNextStepHandler());
    this.socket.on(`stopExcersize`, () => this.WSStopExcersize());
    // this.socket.on(`lightUp`, () => this.WSLightUpDirectionHandler());
    // this.socket.on(`initDirection`, direction => this.handleWSLightDirectionInit(direction));
    // this.socket.on(`changeFunction`, func => this.WSChangeFunctionHandler(func));
  }


  WSStopExcersize() {
    //
    currentDirectionIndex = 0;
    let {directions} = this.state;

    directions = directions.map(d => {

      if (d.settings) {
        delete d.settings;
        d.shutDown = true;
      }

      this.WSLightOffDirection(d.socketId);

      return d;
    });

    this.setState({directions});
  }


  WSNextStepHandler() {
    const {directions, settings} = this.state;

    directions[currentDirectionIndex].shutdown = false;
    directions[currentDirectionIndex].settings = settings[currentDirectionIndex];

    this.setState({directions});

    setTimeout(() => {
      this.WSLightOffDirection(directions[currentDirectionIndex].socketId);
    }, 1500);



    if (currentDirectionIndex < settings.length - 1 && currentDirectionIndex < directions.length - 1) {


      setTimeout(() => {

        currentDirectionIndex ++;
        const directionLightTrigger = {
          directionSocketId: directions[currentDirectionIndex].socketId,
          time: false
        };
        this.WSLightUpDirection(directionLightTrigger);
      }, 1500);
    }
  }


  WSSettingsDirectionsHandler(settings) {
    // console.log(`settings`, directions);
    this.setState({settings});
    const {directions} = this.state;

    const directionLightTrigger = {
      directionSocketId: directions[0].socketId,
      time: false
    };

    this.WSLightUpDirection(directionLightTrigger);
  }


  WSInitHandler(directions) {
    this.setState({directions});
  }

  WSUpdateDirectionsHandler(socketId) {
    const {directions} = this.state;

    const filteredDirections = directions.filter(d => {
      return d.socketId !== socketId;
    });

    this.setState({directions: filteredDirections});
  }

  WSDirectionJoinedHandler(direction) {
    const {directions} = this.state;

    directions.push(direction);

    this.setState({directions});
  }

  WSLightUpDirection(directionLightTrigger) {
    let {directions} = this.state;
    const {directionSocketId, time} = directionLightTrigger;

    directions = directions.map(d => {
      if (d.socketId === directionSocketId) {
        d.allLights = true;
        if (time) {
          setTimeout(() => {
            d.allLights = false;
            this.setState({directions});
          }, 2000);
        }
      }
      return d;
    });

    this.setState({directions});
  }


  WSLightOffDirection(directionSocketId) {

    let {directions} = this.state;

    directions = directions.map(d => {
      if (d.socketId === directionSocketId) {
        d.allLights = false;
      }
      return d;
    });

    this.setState({directions});
  }

  renderDirections() {
    const {directions} = this.state;

    return directions.map((d, index) => {
      return (
        <div key={index}>
          <Direction order={index} key={index} {...d} />
        </div>
      );
    });
  }

  render() {
    return (
      <section className='fieldPage' onClick={e => this.ShowFaceHandler(e)} ref={f => {this.field = f;}}>
        <div className='cursorFollower' ref={c => {this.cursor = c;}}></div>
        {this.renderDirections()}
      </section>
    );
  }

}

Field.propTypes = {
  allLights: React.PropTypes.bool,
  func: React.PropTypes.string,
  data: React.PropTypes.object
};

export default Field;
