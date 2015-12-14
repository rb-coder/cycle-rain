/** @jsx CycleDOM.hJSX */
import Rx from 'rx';
import CycleDOM from '@cycle/dom';

const communication = ({props, DOM}) => {
  let intent = (DOM) => { return {
      start$: DOM.select('.start').events('click')
  } };
  let model = (props, actions) => Rx.Observable.combineLatest(props.get('ready'), props.get('over'), (ready, over) => {
    return {
      ready: ready,
      over: over
    }
  });
  let view = (state$) => state$.map(({ready, over, time, score}) => {
    let message = null;
    if (ready) {
      message = <div className="start-instructions">
                  <p className="instructions">Type letters to make them disappear</p>
                  <button className="start">Start</button>
                 </div>;
    } else if (over) {
      message = <div className="the-end">
                  <h1 className="game-over">Game over!</h1>
                  <button className="start">Try again</button>
                </div>;
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
}

export default communication;
