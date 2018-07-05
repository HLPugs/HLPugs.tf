import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';

class SteamLogIn extends React.Component {
  render() {
    return(
      <a id="SteamLogIn" href="/authenticate">
        <FontAwesomeIcon icon={['fab', 'steam-symbol']} />
        <span>Sign in with Steam</span>
      </a>
    );
  }
}

export default SteamLogIn;