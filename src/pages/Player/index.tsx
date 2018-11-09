import * as React from 'react';
import { SiteConfiguration, UserScheme } from '../../common/types';
import Header from '../../components/Header';
import User from '../../components/User';
import Navigation from '../../components/Navigation';
import Settings from '../../components/Settings';
import Profile from '../../components/Profile';

import './style.css';

interface ProfileProps {
  socket: SocketIOClient.Socket;
  configuration: SiteConfiguration;
  user: UserScheme;
}

interface ProfileState {
  settingsOpen: boolean;
  playerData: Object;
}

class Player extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    this.state = {
      settingsOpen: false,
      playerData: {}
    };
  }

  toggleSettings = () => {
    this.setState({
      settingsOpen: !this.state.settingsOpen
    });
  }

  render() {
    return (
      <div id="Profile">
        <Header
          siteName={this.props.configuration.branding.siteName}
          siteSubTitle={this.props.configuration.branding.siteSubTitle}
          logoPath={this.props.configuration.branding.logoPath}
        />
        <User user={this.props.user} settingsOnClick={this.toggleSettings} />
        <Navigation navigationGroup={this.props.configuration.navigation} />
        <Profile />
        <Settings
          visibility={this.state.settingsOpen}
          socket={this.props.socket}
          classes={this.props.configuration.classes}
          settingsOnClick={this.toggleSettings}
          userAlias={this.props.user.alias}
        />
      </div>
    );
  }
}

export default Player;