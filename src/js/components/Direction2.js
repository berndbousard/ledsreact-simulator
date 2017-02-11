import React, {Component} from 'react';

import {Light} from '../components';

const richtingen = [`top`, `left`, `right`, `bottom`];

class Direction extends Component {

  state = {
    allLights: false,
    settings: {},
    kleuren: {
      top: ``,
      right: ``,
      bottom: ``,
      left: ``
    }
  }


  componentDidMount() {

    console.log(`huidige direction`, this.props);

    const {lichten} = this.refs;

    this.lightsOff();

    if (this.props.settings) {

      const {settings} = this.props;
      this.setState({settings});

      this.assignColors(settings.combineLights);

      lichten.addEventListener(`mouseenter`, () => {
        this.assignColors(settings.combineLights);
        this.lightsOn();
      });

      lichten.addEventListener(`mouseleave`, () => {
        this.lightsOff(settings.combineLights);
      });
    }
  }

  shouldComponentUpdate() {
    console.log(`will receive`, this.props.settings);
    return true;
  }

  lightsOn() {
    if (this.refs.lichten) {
      const {lichten} = this.refs;
      lichten.style.opacity = 1;
    }
  }

  lightsOff() {
    if (this.refs.lichten) {
      const {lichten} = this.refs;
      lichten.style.opacity = 0;
    }
  }



  assignColors(combine) {
    const {directions} = this.props.settings;
    const {kleuren} = this.state;

    for (let i = 0;i < richtingen.length;i ++) {
      kleuren[richtingen[i]] = directions[richtingen[i]].colors[Math.floor(Math.random() * directions[richtingen[i]].colors.length)];
    }

    let randomColor;
    let randomRichting;

    if (!combine) {

      while (randomColor === undefined) {
        const randomValue = Math.floor(Math.random() * richtingen.length);
        randomColor = kleuren[richtingen[randomValue]];
        randomRichting = richtingen[randomValue];
      }

      for (let i = 0;i < richtingen.length;i ++) {
        // console.log(richtingen[i], directions[richtingen[i]].colors);
        if (richtingen[i] !== randomRichting) {
          kleuren[richtingen[i]] = undefined;
        }
      }
    }

    this.setState({kleuren});
  }

  render() {

    const {allLights} = this.props;
    const {kleuren} = this.state;



    console.log(`rendar`, this.props.settings);



    if (allLights) {
      this.lightsOn();
    } else {
      this.lightsOff();
    }

    return (
    <div className='directionwrapper' data-directionKey={this.props.socketId}>
      <div className='direction'>
        <div className='lightsWrapper' ref={`lichten`}>
          {/* {allLights ? this.lightsOn() : this.lightsOff()} */}
          <Light lightPosition={`lightUP`} allLights={allLights} color={kleuren.top} />
          <Light lightPosition={`lightRIGHT`} allLights={allLights} color={kleuren.right} />
          <Light lightPosition={`lightDOWN`} allLights={allLights} color={kleuren.bottom} />
          <Light lightPosition={`lightLEFT`} allLights={allLights} color={kleuren.left} />
        </div>
      </div>
      <div className='scanSignal'></div>
    </div>
    );
  }
}

Direction.propTypes = {
  socketId: React.PropTypes.string,
  allLights: React.PropTypes.bool,
  settings: React.PropTypes.object,
};

export default Direction;
