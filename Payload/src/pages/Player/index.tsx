import React from 'react';
import { SiteConfiguration, UserViewModel } from '../../common/types';
import Header from '../../components/Header';
import User from '../../components/User';
import Navigation from '../../components/Navigation';
import Settings from '../../components/Settings';
import Profile from '../../components/Profile';
import './style.scss';
import { RouteComponentProps } from 'react-router';

interface MatchParams {
  steamid: string;
}

interface ProfileProps extends RouteComponentProps<MatchParams> {
  socket: SocketIOClient.Socket;
  configuration: SiteConfiguration;
  user: UserViewModel;
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
    const { steamid } = this.props.match.params;
    
    return (
      <div id="Profile">
        <Header
          siteName={this.props.configuration.branding.siteName}
          siteSubTitle={this.props.configuration.branding.siteSubTitle}
          logoPath={this.props.configuration.branding.logoPath}
        />
        <User user={this.props.user} settingsOnClick={this.toggleSettings} />
        <Navigation navigationGroup={this.props.configuration.navigation} />
        <Profile steamid={steamid}/>
        <Settings
          visibility={this.state.settingsOpen}
          socket={this.props.socket}
          classes={this.props.configuration.classes}
          settingsOnClick={this.toggleSettings}
          userAlias={this.props.user.alias}
          settings={this.props.user.settings}
        />
      </div>
    );
  }
}

export default Player;