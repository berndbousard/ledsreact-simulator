import React from 'react';

import {Direction, FunctionBar} from '../components';

const Home = ({allLights, func, data}) => {
  return (
    <section className='home'>
      <Direction allLights={allLights} {...data} />
      <FunctionBar func={func} />
    </section>
  );
};

Home.propTypes = {
  allLights: React.PropTypes.bool,
  func: React.PropTypes.string,
  data: React.PropTypes.object
};

export default Home;
