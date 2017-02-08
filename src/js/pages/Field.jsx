import React, {Component} from 'react';
import io from 'socket.io-client';

import {Direction} from '../components';

class Field extends Component {

  state = {
    directions: []
  }

  componentDidMount() {
    this.socket = io(`/`, {query: `client=field`});
    this.socket.on(`init`, directions => this.WSInitHandler(directions));
    this.socket.on(`updateDirections`, socketId => this.WSUpdateDirectionsHandler(socketId));
    this.socket.on(`directionJoined`, direction => this.WSDirectionJoinedHandler(direction));
    this.socket.on(`lightUpDirection`, directionSocketId => this.WSLightUpDirection(directionSocketId));
    // this.socket.on(`lightUp`, () => this.WSLightUpDirectionHandler());
    // this.socket.on(`initDirection`, direction => this.handleWSLightDirectionInit(direction));
    // this.socket.on(`changeFunction`, func => this.WSChangeFunctionHandler(func));

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

  WSLightUpDirection(directionSocketId) {
    let {directions} = this.state;

    directions = directions.map(d => {
      if (d.socketId === directionSocketId) {
        d.allLights = true;

        setTimeout(() => {
          d.allLights = false;
          this.setState({directions});

        }, 1000);
      }
      return d;
    });

    this.setState({directions});
  }

  renderDirections() {
    const {directions} = this.state;

    console.log(directions.length);

    return directions.map((d, index) => {
      return (
        <Direction key={index} {...d} />
      );
    });
  }

  render() {
    return (
      <section className='fieldPage'>
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
