import React, {Component} from 'react';

import {Light} from '../components';

const richtingen = [`top`, `left`, `right`, `bottom`];
let inZone = false;
let delayDirection;

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

  componentWillReceiveProps(props) {

    const {lichten, scanner, directionwrapper} = this.refs;

    this.setState({settings: props.settings});

    if (props.shutDown) {
      // this.setState({settings: props.settings});
      scanner.classList.remove(`scanSignal`);
      directionwrapper.removeEventListener(`mouseenter`, e =>  this.mouseEnterEvent(e, props));
      directionwrapper.addEventListener(`mouseenter`, () => {
        inZone = false;
      });
    }

    if (props.settings) {

      const x = props.settings.x;
      const y = props.settings.y;

      directionwrapper.style.position = `absolute`;
      directionwrapper.style.left = `${(x * window.innerWidth) - 90}px`;
      directionwrapper.style.top = `${(y * window.innerHeight) - 90}px`;

      scanner.classList.add(`scanSignal`);

      const {settings} = props;
      this.setState({settings});

      this.assignColors(settings.combineLights, settings.directions);

      directionwrapper.addEventListener(`mouseenter`, e =>  this.mouseEnterEvent(e, props));

      directionwrapper.addEventListener(`mouseleave`, () => {
        if (inZone && !props.shutDown) {
          this.lightsOff();
          inZone = false;
        }
      });
    }
  }

  mouseEnterEvent(e, props) {
    if (this.state.settings) {
      const {delay} = this.state.settings;
      delayDirection = delay;
    }

    const {settings} = props;
    this.assignColors(settings.combineLights, settings.directions);
    inZone = true;

    // console.log(`settings delay`, settings.delay);

    setTimeout(() => {
      if (inZone && !props.shutDown) {
        this.lightsOn();
      }
    }, delayDirection * 1000);
  }


  componentDidMount() {

    this.lightsOff();

    const {order} = this.props;
    const {directionwrapper} = this.refs;

    directionwrapper.style.position = `absolute`;
    directionwrapper.style.left = `${((order + 1) * 200) - 200}px`;
    directionwrapper.style.top = `${window.innerHeight - 220  }px`;
    directionwrapper.style.zIndex = 20 - order;

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

  assignColors(combine, directions) {
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

    if (allLights) {
      this.lightsOn();
    } else {
      this.lightsOff();
    }

    return (
    <div className='directionwrapper' ref={`directionwrapper`} data-directionKey={this.props.socketId}>
      <div className='direction'>
        <div className='lightsWrapper' ref={`lichten`}>
          {/* {allLights ? this.lightsOn() : this.lightsOff()} */}
          <Light lightPosition={`lightUP`} allLights={allLights} color={kleuren.top} />
          <Light lightPosition={`lightRIGHT`} allLights={allLights} color={kleuren.right} />
          <Light lightPosition={`lightDOWN`} allLights={allLights} color={kleuren.bottom} />
          <Light lightPosition={`lightLEFT`} allLights={allLights} color={kleuren.left} />
        </div>
      </div>
      <div ref={`scanner`}></div>
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
