import * as React from 'react';
import UserInfo from './UserInfo';
import UserDropDown from './UserDropDown';
import SteamLogIn from './SteamLogIn';
import { UserScheme } from '../../common/types';
import './style.css';

interface UserProps {
  user: UserScheme;
  settingsOnClick: Function;
}

class User extends React.Component<UserProps, {}> {
  
  render() {
    if (this.props.user.loggedIn) {
      return (
        <div id="User">
          <UserInfo alias={this.props.user.alias} avatar={this.props.user.avatar} />
          <UserDropDown steamid={this.props.user.steamid} settingsOnClick={this.props.settingsOnClick} />
        </div>
      );
    } else if (this.props.user.loggedIn === false) {
      return (
        <div id="User">
          <SteamLogIn />
        </div>
      );
    }
    return null;
  }
}

export default User;