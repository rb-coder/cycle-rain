/** @jsx CycleDOM.hJSX */
import Rx from 'rx';
import CycleDOM from '@cycle/dom';

const playground = ({props, DOM}) => {
  let intent = (DOM) => null;
  let model = (props, actions) => props.get('letters');
  let view = (state$) => state$.map((letters) =>
    <div className="playground">
      {letters.map((letter) => <div className="letter" id={letter.endTime} style={{left: letter.position + '%'}}>{letter.symbol}</div>)}
   </div>
  );

  return {
    DOM : view(model(props, intent(DOM)))
  }
}

export default playground;
