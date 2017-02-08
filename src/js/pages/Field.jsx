import React, {Component} from 'react';
import io from 'socket.io-client';

import {Direction} from '../components';
let currentDirectionIndex = 0;


class Field extends Component {

  state = {
    directions: [],
    settings: []
  }

  componentDidMount() {

    //code voor cursorshit, moet nog een image in gepropt worden
    // document.addEventListener(`mousemove`, e => {
    //   const {cursor} = this.refs;
    //   cursor.style.display = `block`;
    //   cursor.style.left = `${e.screenX - 0}px`;
    //   cursor.style.top = `${e.screenY - 105}px`;
    //   console.log(e.screenX);
    // });

    this.socket = io(`/`, {query: `client=field`});
    this.socket.on(`init`, directions => this.WSInitHandler(directions));
    this.socket.on(`updateDirections`, socketId => this.WSUpdateDirectionsHandler(socketId));
    this.socket.on(`directionJoined`, direction => this.WSDirectionJoinedHandler(direction));
    this.socket.on(`lightUpDirection`, directionLightTrigger => this.WSLightUpDirection(directionLightTrigger));
    this.socket.on(`changeDirections`, settings => this.WSSettingsDirectionsHandler(settings));
    this.socket.on(`nexStep`, () => this.WSNextStepHandler());
    // this.socket.on(`lightUp`, () => this.WSLightUpDirectionHandler());
    // this.socket.on(`initDirection`, direction => this.handleWSLightDirectionInit(direction));
    // this.socket.on(`changeFunction`, func => this.WSChangeFunctionHandler(func));
  }







  WSNextStepHandler() {

    const {directions, settings} = this.state;

    this.WSLightOffDirection(directions[currentDirectionIndex].socketId);

    directions[currentDirectionIndex].settings = settings[currentDirectionIndex];
    this.setState(directions);

    if (currentDirectionIndex < directions.length - 1) {
      currentDirectionIndex ++;

      const directionLightTrigger = {
        directionSocketId: directions[currentDirectionIndex].socketId,
        time: false
      };
      this.WSLightUpDirection(directionLightTrigger);
    }
  }


  WSSettingsDirectionsHandler(settings) {
    // console.log(`settings`, directions);
    this.setState({settings});
    const {directions} = this.state;

    console.log(directions);

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
      <section className='fieldPage'>
        <div className='cursorFollower' ref={`cursor`}></div>
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
