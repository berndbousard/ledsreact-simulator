import React from 'react';

const Light = ({allLights}) => {

  return (
    <div className={`directionLight ${allLights ? `lightOn` : `lightOff`}`}></div>
  );

};

Light.propTypes = {
  allLights: React.PropTypes.bool
};

export default Light;
