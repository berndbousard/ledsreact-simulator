import React, {PureComponent} from 'react';
import {Match, BrowserRouter as Router} from 'react-router';
import io from 'socket.io-client';

import Home from '../pages/Home';

class App extends PureComponent { // Component zonder state

  constructor() {
    super();

    this.socket = io(`/`, {query: `client=direction`});
    this.socket.on(`lightUp`, () => this.WSLightUpDirectionHandler());

    this.state = {
      allLights: false
    };
  }

  WSInitHandler() {
    console.log(`This Direction is Connected`);
  }

  WSLightUpDirectionHandler() {
    this.setState({allLights: true});

    setTimeout(() => {
      this.setState({allLights: false});
    }, 1000);
  }

  render() {

    const {allLights} = this.state;

    return (
      <Router>
        <main>
          <Match
            exactly pattern='/'
            render={() => {
              return (
                <Home allLights={allLights} />
              );
            }}
          />
        </main>
      </Router>
    );
  }
}

export default App;
