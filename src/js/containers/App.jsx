import React, {PureComponent} from 'react';
import {Match, BrowserRouter as Router} from 'react-router';
import io from 'socket.io-client';

import Home from '../pages/Home';

class App extends PureComponent { // Component zonder state

  componentDidMount() {
    this.socket = io(`/`, {query: `client=direction`});
    this.socket.on(`init`);
  }

  WSInitHandler() {
    console.log(`This Direction is Connected`);
  }

  render() {
    return (
      <Router>
        <main>
          <Match
            exactly pattern='/'
            component={Home}
          />
        </main>
      </Router>
    );
  }
}

export default App;
