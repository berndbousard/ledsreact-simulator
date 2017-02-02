import React from 'react';
import {Light} from '../components';

const Direction = ({allLights}) => {

  return (
    <div className='direction'>
      <Light allLights={allLights} />
      <Light allLights={allLights} />
      <Light allLights={allLights} />
      <Light allLights={allLights} />
    </div>
  );

};

Direction.propTypes = {
  allLights: React.PropTypes.bool
};

export default Direction;
