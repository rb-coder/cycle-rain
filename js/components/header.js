/** @jsx CycleDOM.hJSX */
import Rx from 'rx';
import CycleDOM from '@cycle/dom';

const header = ({props, DOM}) => {
  let intent = (DOM) => null;
  let model = (props, actions) => Rx.Observable.combineLatest(
    props.get('minutes'),
    props.get('seconds'),
    props.get('score'),
    (minutes, seconds, score) => {
      return {
        minutes,
        seconds,
        score
      };
    }
  );
  let view = (state$) => state$.map(({minutes, seconds, score}) =>
    <div className="header-bar">
	  <div className="time">Elapsed: {minutes}m : {seconds}s</div>
	  <div className="score">Score: {score}</div>
	</div>
  );

  return {
    DOM : view(model(props, intent(DOM)))
  }
}

export default header;
