/** @jsx CycleDOM.hJSX */
import Rx from 'rx';
import CycleDOM from '@cycle/dom';

const header = ({props, DOM}) => {
  let intent = (DOM) => null;
  let model = (props, actions) => Rx.Observable.combineLatest(props.get('time'), props.get('score'),
    (time, score) => {
      return {
        time: {
          min: Math.floor(time / 600),
          sec: Math.floor((time % 600) / 10)
        },
        score
      };
    }
  );
  let view = (state$) => state$.map((state) =>
    <div className="header-bar">
	  <div className="time">Elapsed: {state.time.min} : {state.time.sec}</div>
	  <div className="score">Score: {state.score}</div>
	</div>
  );

  return {
    DOM : view(model(props, intent(DOM)))
  }
}

export default header;
