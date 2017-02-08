import React, {Component} from 'react';

class Light extends Component {

  componentDidMount() {

    // const {allLights, isActive, color} = this.props;
    // const {light, lightColor} = this.refs;

    // console.log(allLights);

    /*
    if (allLights) {
      lightColor.style.backgroundColor = `red`;
      setTimeout(() => {
        lightColor.style.backgroundColor = color;
      }, 2000);
    }*/
  }

  render() {
    const {allLights, lightPosition, isActive, color, delay} = this.props;

    console.log(color);

    return (
    <div className={`light ${lightPosition}`} style={isActive ? {opacity: 1} : {opacity: 0}} >
      <div className='whitelight'></div>
      <div className='directionLight' style={{backgroundColor: color}}></div>
    </div>
    );}
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
