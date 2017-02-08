import React from 'react';

const Light = props => {

  return (
    <div className={`light ${props.lightPosition}`} style={props.isActive ? {opacity: 1} : {opacity: 0}} >
      <div className='whitelight'></div>
      <div className='directionLight' style={{backgroundColor: props.color}}></div>
    </div>
  );
};

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
