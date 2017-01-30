import React from 'react';

import {Direction} from '../components';

const Home = props => {

  const {allLights} = props;

  return (
    <Direction allLights={allLights} />
  );
};

Home.propTypes = {
  allLights: React.PropTypes.boolean
};

export default Home;
