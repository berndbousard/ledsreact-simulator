import React, {Component} from 'react';
import {Light} from '../components';

// const cssClasses = [`lightUP`, `lightRIGHT`, `lightDOWN`, `lightLEFT` ];
const richtingen = [`top`, `right`, `down`, `left`];
const colors = [`red`, `yellow`, `blue`, `green`];
let richting;
let check = false;

//bij enteren random waarde + random kleur aanpassen -> setState
//meerdere richtingen -> random kleur

class Direction extends Component {

  // state = {
  //   allLights: this.props.allLights
  // }

  componentDidMount() {

    const {direction, lights} = this.refs;
    lights.style.opacity = 0;

    // setTimeout(() => {
    //   console.log(`hey`);
    //   this.setState({allLights: false});
    // }, 2000);

    // colorsFetched = richtingen.map(r => {
    //   return (this.props[r].color);
    // });

    /*
    if (this.state.allLights) {
      richtingen.map(r => {
        this.props[r].color = `red`;
      });
      lights.style.opacity = 1;

      setTimeout(() => {
        this.setState({allLights: false});

        lights.style.opacity = 0;
        richtingen.map((r, index) => {
          this.props[r].color = colorsFetched[index];
        });
      }, 1000);

    } else {
      console.log(this.props);
      lights.style.opacity = 0;
    }*/


    //check ofdat de muis in de detectiezone direction zit
    direction.addEventListener(`mouseenter`, () => {
      //lights aanleggen
      lights.style.opacity = 1;
      this.setState({inZone: true});

      //random direction gereneren met toegekende kleur
      this.generateRandomDirection();

      //random kleur toekennen aan random richting
      this.pairColor();

      //genereer random kleur bij gekende richting
      this.generateRandomColorWithDirection();
    });

    //check ofdat de muis uit de detectiezone direction zit
    direction.addEventListener(`mouseleave`, () => {
      //lights afleggen
      lights.style.opacity = 0;
    });
  }

  //Kleur generen wanneer richting gekend is
  generateRandomColorWithDirection() {

    richtingen.map(r => {
      if (this.props[r].colorIsRandom) {
        console.log(`hey -----`);
        this.props[r].color = this.generateRandomColor();
      }
    });
  }

  //Random richting generen
  generateRandomDirection() {
    const {richtingIsRandom} = this.props;

    //check ofdat de richting gekend
    if (richtingIsRandom) {

      //random generen
      let localRichtingen = richtingen;
      richting = localRichtingen[Math.floor(Math.random() * 4)];
      this.props[richting].isActive = true;

      //random value uit de copy van de array filteren
      localRichtingen = richtingen.filter(r => {
        return r !== richting;
      });

      //alle andere richtingen uitzetten (double check)
      localRichtingen.map(r => {
        this.props[r].isActive = false;
      });
    }
  }

  //kleur toekennen aan random richting
  pairColor() {
    const {richtingIsRandom, colorIsRandom} = this.props;

    //check op randomrichting & random kleur
    if (richtingIsRandom && colorIsRandom) {
      this.props[richting].color = this.generateRandomColor();
    }
  }

  //randomkleur genereren
  generateRandomColor() {
    return (colors[Math.floor(Math.random() * 4)]);
  }

  render() {
    const {allLights, richtingIsRandom, top, right, down, left} = this.props;

    //double check voor die random richting
    if (!check && richtingIsRandom) {
      richtingen.map(r => {
        this.props[r].isActive = false;
      });
      check = true;
    }

    return (
      <div className='directionwrapper' ref={`direction`}>
        <div className='direction' >
          <div className='lightsWrapper' ref={`lights`}>
          <Light lightPosition={`lightUP`} allLights={allLights} {...top} />
          <Light lightPosition={`lightRIGHT`} allLights={allLights} {...right}  />
          <Light lightPosition={`lightDOWN`} allLights={allLights} {...down} />
          <Light lightPosition={`lightLEFT`} allLights={allLights} {...left} />
          </div>
        </div>
      </div>
    );
  }
}

Direction.propTypes = {
  allLights: React.PropTypes.bool,
  richtingIsRandom: React.PropTypes.bool,
  colorIsRandom: React.PropTypes.bool,
  top: React.PropTypes.object,
  right: React.PropTypes.object,
  down: React.PropTypes.object,
  left: React.PropTypes.object,
};

export default Direction;
