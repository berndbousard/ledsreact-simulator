import React from 'react';

const Light = ({allLights}) => {

  return (
    <div className={allLights ? `directionLight lightOn` : `directionLight lightOff`}></div>
  );

};

Light.propTypes = {
  allLights: React.PropTypes.object
};

export default Light;
