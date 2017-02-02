import React from 'react';

const FunctionBar = ({func}) => {

  return (
    <div className='functionBar'>
      <p className='functionBarText'>{func}</p>
    </div>
  );

};

FunctionBar.propTypes = {
  allLights: React.PropTypes.bool,
  func: React.PropTypes.string
};

export default FunctionBar;
