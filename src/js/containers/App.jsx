import React, {PureComponent} from 'react';
import {Match, BrowserRouter as Router} from 'react-router';
import io from 'socket.io-client';

import Home from '../pages/Home';

class App extends PureComponent { // Component zonder state

  constructor() {
    super();

    this.socket = io(`/`, {query: `client=direction`});
    this.socket.on(`lightUp`, () => this.WSLightUpDirectionHandler());
    this.socket.on(`initDirection`, direction => this.handleWSLightDirectionInit(direction));
    this.socket.on(`changeFunction`, func => this.WSChangeFunctionHandler(func));

    this.state = {
      allLights: false,
      func: `richting`,
      batteryLevel: 0
    };
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
      this.setState({allLights: false});
    }, 1000);
  }

  render() {

    const {allLights, func} = this.state;

    return (
      <Router>
        <main>
          <Match
            exactly pattern='/'
            render={() => {
              return (
                <Home allLights={allLights} func={func} />
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
