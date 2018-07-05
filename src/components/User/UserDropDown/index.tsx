import * as React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

interface UserDropDownProps {
  steamid?: string;
}

class UserDropDown extends React.Component<UserDropDownProps, {}> {
  render() {
    return(
      <ul id="UserDropDown">
        <li>
          <Link to={`/player/${this.props.steamid}`}>
            Profile
          </Link>
        </li>
        <li>
          Settings
        </li>
        <li>
          <a href="/logout">
            Logout
          </a>
        </li>
      </ul>
    );
  }
}

export default UserDropDown;