import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import * as WebFont from 'webfontloader';
import * as moment from 'moment';

WebFont.load({
  google: {
    families: ['Lato:400,700']
  }
});

moment.updateLocale('en', {
  calendar: {
    sameDay: 'LT'
  }
});

import './style.css';
import './animations.css';
import './buttons.css';
import './formElements.css';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
