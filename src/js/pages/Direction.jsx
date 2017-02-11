import React, {Component} from 'react';
import io from 'socket.io-client';

class Direction extends Component {

  componentDidMount() {
    this.socket = io(`/`, {query: `client=direction`});
  }

  render() {
    return (
      <section className='directionPage'>
      </section>
    );
  }

}

Direction.propTypes = {
  allLights: React.PropTypes.bool,
  func: React.PropTypes.string,
  data: React.PropTypes.object
};

export default Direction;
