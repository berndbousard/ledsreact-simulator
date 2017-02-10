import React, {Component} from 'react';

class Light extends Component {

  componentDidMount() {

  }

  render() {

    let {color} = this.props;
    const {allLights} = this.props;
    let whiteColor = ``;

    if (allLights) {
      color = `red`;
    } else {
      color = this.props.color;
    }

    if (color !== undefined) {
      whiteColor = `white`;
    } else {
      whiteColor = ``;
    }

    return (
    <div className={`light ${this.props.lightPosition}`} ref={`light`} >
      <div className='whitelight' style={{backgroundColor: whiteColor}}></div>
      <div className='directionLight' style={{backgroundColor: color}}></div>
    </div>
    );
  }
}

Light.propTypes = {
  allLights: React.PropTypes.bool,
  lightPosition: React.PropTypes.string,
  isActive: React.PropTypes.bool,
  isRandom: React.PropTypes.bool,
  color: React.PropTypes.string,
  delay: React.PropTypes.number,
  inZone: React.PropTypes.bool
};

export default Light;
