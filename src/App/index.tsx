import * as React from 'react';
import * as io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { SiteConfiguration, UserScheme } from '../common/types';
import Home from '../pages/Home';
import Banned from '../pages/Banned';
import './style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSteamSymbol, faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';
import {
  faUser,
  faCog,
  faSignOutAlt,
  faTachometerAlt,
  faGavel,
  faMicrophone,
  faComments,
  faBullhorn,
  faCheck,
  faTimes,
  faSmile,
  faStar,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faSteamSymbol,
  faDiscord, faUser,
  faCog,
  faSignOutAlt,
  faTachometerAlt,
  faGavel,
  faMicrophone,
  faPatreon,
  faComments,
  faBullhorn,
  faCheck,
  faTimes,
  faSmile,
  faStar,
  faArrowDown
);

interface AppState {
  configuration?: SiteConfiguration;
  user?: UserScheme;
}

class App extends React.Component<{}, AppState> {
  
  private socket: SocketIOClient.Socket;
  private dummyConfiguration: SiteConfiguration;
  
  constructor(props: Object) {
    super(props);
    
    this.socket = io(`${window.location.protocol}//${window.location.hostname}:3001`);

    this.dummyConfiguration = {
      branding: {
        siteName: '',
        siteSubTitle: '',
        logoPath: ''
      },
      navigation: [],
      classes: []
    };

    this.socket.on('siteConfiguration', (configuration: SiteConfiguration) => {
      this.setState({
        configuration: configuration
      });
    });

    this.socket.on('user', (user: UserScheme) => {
      this.setState({
        user: user
      });
    });
    
    this.state = {};
  }
  
  render() {
    if (this.state.configuration && this.state.user) {
      return (
        <Router>
          <Switch>
            <Route 
              exact={true} 
              path="/" 
              render={() => 
                <Home 
                  socket={this.socket} 
                  configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration} 
                  user={this.state.user ? this.state.user : {}} 
                />
              } 
            />
            <Route
              exact={true}
              path="/banned"
              render={() =>
                <Banned
                  socket={this.socket}
                  configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
                />
              }
            />
            <Redirect from="*" to="/" />
          </Switch>
        </Router>
      );
    }

    return null;
  }
}

export default App;
