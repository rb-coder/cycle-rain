/** @jsx CycleDOM.hJSX */
import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

import playground from './components/playground';
import header from './components/header';
import communication from './components/communication';

let main = ({DOM}) => {
  let intent = (DOM) => {
      return {
        time$: Rx.Observable.interval(100),
        start$: DOM.select('.communication').events('start').map((ev) => true),
        letter$: Rx.Observable.fromEvent(document, 'keydown').debounce(100)
            .map((ev) => ev.keyCode)
            .filter((keyCode) => keyCode >= 65 && keyCode <= 90)
            .map((keyCode) => String.fromCharCode(keyCode))
            .map((letter) => letter.toUpperCase())
      }
  };
  let model = (actions) => {
      let initialState = () => {
          return {
              time: 0,
              score: 0,
              ready: true,
              running: false,
              over: false,
              letters: []
          }
      };

      let start$ = actions.start$.map((ev) => {
          return (state) => {
              if (state.ready || state.over) {
                  let newState = initialState();
                  newState.running = true;
                  newState.ready = false;
                  newState.over = false;
                  return newState;
              }
              return state;
          }
      });
      let letter$ = actions.letter$.map((currentLetter) => {
          return (state) => {
              if (state.running && state.letters.filter(letter => letter.symbol === currentLetter).length > 0) {
                  let newState = JSON.parse(JSON.stringify(state));
                  newState.letters = [];
                  state.letters.forEach((letter) => {
                      if (letter.symbol === currentLetter) {
                          newState.score += (letter.endTime - newState.time);
                      } else {
                          newState.letters.push(letter);
                      }
                  });

                  return newState;
              }
              return state;
          }
      });
      let time$ = actions.time$.map(() => {
        return (state) => {
          if (state.running) {
            let newState = JSON.parse(JSON.stringify(state));
            newState.time += 1;
            if (newState.letters.length > 0, newState.letters.filter((letter) => letter.endTime < newState.time).length > 0) {
                newState.running = false;
                newState.ready = false;
                newState.over = true;
            } else if (newState.time % Math.round(100 / (1 + Math.log(newState.time) / 2)) === 1) {
              Rx.Observable.just(Math.random())
                .map(rand => Math.round(rand * 25))
                .map(rand => 65 + rand)
                .map(charCode => String.fromCharCode(charCode))
                .map(letter => letter.toUpperCase())
                .map(letter => {
                  return {
                    symbol: letter,
                    position: Math.round(Math.random() * 50) * 2,
                    endTime: state.time + 100
                  };
                })
                .subscribe((newLetter) => {
                  newState.letters.push(newLetter);
                });
              }
              return newState;
            }
            return state;
          }
      });

      let transform$ = Rx.Observable.merge(
        // Controlled by a Player
        start$, letter$,

        // Not controlled by a Player
        time$
      );

      return transform$
        .startWith(initialState())
        .scan((state, transform) => transform(state))
        .distinctUntilChanged();
  }

  let view = (state$) => state$.map((state) =>
    <div className="page">
      <header key="1" time={state.time} score={state.score} />
      <playground className="playground" key="2" letters={state.letters} />
      <communication className="communication" key="3" ready={state.ready} over={state.over} />
    </div>
  );

  return {
    DOM: view(model(intent(DOM)))
  };
}

Cycle.run(main, {
  DOM: CycleDOM.makeDOMDriver('#app', {
    'playground': playground,
	'header': header,
	'communication': communication
  })
});
