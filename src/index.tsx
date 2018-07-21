import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import * as WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ['Lato:400,700']
  }
});

import './style.css';
import './animations.css';
import './buttons.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
