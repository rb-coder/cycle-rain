/** @jsx CycleDOM.hJSX */
import Rx from 'rx';
import CycleDOM from '@cycle/dom';

const playground = ({props, DOM}) => {
  let drawLetter = (time, letter) => {
    let percent = Math.round((time - letter.startTime) * 100 / (letter.endTime - letter.startTime));
    let letterStyle = {
        left: letter.position + '%',
        bottom: (100 - percent) + '%',
        color: 'rgb(' + Math.round(255 * percent / 100) + ',0,0)'
    };

    return <div className="letter" style={letterStyle}>{letter.symbol}</div>
  };

  let intent = (DOM) => null;
  let model = (props, actions) => Rx.Observable.combineLatest(props.get('time'), props.get('letters'),
    (time, letters) => {
      return {
        time,
        letters
      };
    }
  );
  let view = (state$) => state$.map(({time, letters}) =>
    <div className="playground">
      {letters.map((letter) => drawLetter(time, letter))}
   </div>
  );

  return {
    DOM : view(model(props, intent(DOM)))
  }
}

export default playground;
