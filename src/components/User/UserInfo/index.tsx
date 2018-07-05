import * as React from 'react';
import './style.css';

interface UserInfoProps {
  alias?: string;
  avatar?: string;
}

class UserInfo extends React.Component<UserInfoProps, {}> {
  render() {
    return (
      <>
        <div id="userIcon" style={{backgroundImage: `url(${this.props.avatar})`}} />
        <div id="userName">
          {this.props.alias}
        </div>
      </>
    );
  }
}

export default UserInfo;