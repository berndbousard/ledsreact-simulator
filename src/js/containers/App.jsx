import React, {PureComponent} from 'react';
import {Match, BrowserRouter as Router} from 'react-router';

import Field from '../pages/Field';
import Direction from '../pages/Direction';

class App extends PureComponent { // Component zonder state

  constructor() {
    super();

    this.state = {
      allLights: false,
      func: `richting`,
      batteryLevel: 0,

      data: {
        richtingIsRandom: false,
        colorIsRandom: false,
        top: {
          isActive: true,
          colorIsRandom: false,
          color: `blue`,
          delay: 0,
        },
        down: {
          isActive: true,
          colorIsRandom: true,
          color: ``,
          delay: 1,
        },
        left: {
          isActive: false,
          colorIsRandom: false,
          color: `green`,
          delay: 0,
        },
        right: {
          isActive: false,
          colorIsRandom: true,
          color: ``,
          delay: 0,
        },
      }
    };
  }


  // x, y -> 0 niet deployen


  componentDidMount() {


    // this.WSLightUpDirectionHandler();
  }

  WSInitHandler() {
    console.log(`This Direction is Connected`);
  }

  handleWSLightDirectionInit({direction}) {
    this.setState({
      func: direction.function,
      batteryLevel: direction.batteryLevel
    });
  }

  WSChangeFunctionHandler(func) {
    this.setState({func: func.function});
  }

  WSLightUpDirectionHandler() {

    this.setState({allLights: true});

    setTimeout(() => {
      console.log(`in`);
      this.setState({allLights: false});
    }, 1000);
  }

  render() {

    return (
      <Router>
        <main>
          <Match
            exactly pattern='/field'
            render={() => {
              return (
                <Field />
              );
            }}
          />

          <Match
            exactly pattern='/direction'
            render={() => {
              return (
                <Direction />
              );
            }}
          />

        </main>
      </Router>
    );
  }
}

App.propTypes = {
  allLights: React.PropTypes.bool
};

export default App;
