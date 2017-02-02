import React from 'react';

import {Direction, FunctionBar} from '../components';

const Home = ({allLights, func}) => {

  return (
    <section className='home'>
      <Direction allLights={allLights} />
      <FunctionBar func={func} />
    </section>
  );
};

Home.propTypes = {
  allLights: React.PropTypes.bool,
  func: React.PropTypes.string
};

export default Home;
