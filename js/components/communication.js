/** @jsx CycleDOM.hJSX */
import Rx from 'rx';
import CycleDOM from '@cycle/dom';

let drawStart = () => (
  <div className="start-instructions">
    <p className="instructions">Type letters to make them disappear</p>
    <button className="start">Start</button>
  </div>
);

let drawOver = (minutes, seconds, score) => (
  <div className="the-end">
    <h1 className="game-over">Game over!</h1>
    <p>You survived {minutes} minutes and {seconds} seconds and got {score} points.</p>
    <button className="start">Try again</button>
  </div>
);

const communication = ({props, DOM}) => {
  let intent = (DOM) => { return {
      start$: DOM.select('.start').events('click')
  } };
  let model = (props, actions) => Rx.Observable.combineLatest(
      props.get('ready'),
      props.get('over'),
      props.get('minutes'),
      props.get('seconds'),
      props.get('score'),
      (ready, over, minutes, seconds, score) => {
    return {ready, over, minutes, seconds, score};
}).distinctUntilChanged();
  let view = (state$) => state$.map(({ready, over, minutes, seconds, score}) => {
    let message = null;
    if (ready) {
      message = drawStart();
    } else if (over) {
      message = drawOver(minutes, seconds, score);
    }
    return <div className="communication">{message}</div>;
  });

  let actions = intent(DOM);
  return {
    DOM : view(model(props, actions)),
    events: {
        start: actions.start$
    }
  }
};

export default communication;
