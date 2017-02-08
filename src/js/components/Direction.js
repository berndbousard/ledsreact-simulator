import React from 'react';

import {Light} from '../components';

const Direction = props => {

  console.log(props);

  return (
    <div className='directionwrapper' data-directionKey={props.socketId}>
      <div className='direction'>
        <div className='lightsWrapper'>
          <Light lightPosition={`lightUP`} />
          <Light lightPosition={`lightRIGHT`} />
          <Light lightPosition={`lightDOWN`} />
          <Light lightPosition={`lightLEFT`} />
        </div>
      </div>
    </div>
  );
};

Direction.propTypes = {
  socketId: React.PropTypes.string
};

export default Direction;
