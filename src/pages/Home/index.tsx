import * as React from 'react';
import { SiteConfiguration, UserScheme } from '../../common/types';
import Header from '../../components/Header';
import User from '../../components/User';
import './style.css';

interface HomeProps {
  socket: SocketIOClient.Socket;
  configuration: SiteConfiguration;
  user: UserScheme;
}

class Home extends React.Component<HomeProps, {}> {
  render() {
    return (
      <div id="Home">
        <Header 
          siteName={this.props.configuration.branding.siteName} 
          siteSubTitle={this.props.configuration.branding.siteSubTitle}
          logoPath={this.props.configuration.branding.logoPath} 
        />
        <User user={this.props.user} />
      </div>
    );
  }
}

export default Home;