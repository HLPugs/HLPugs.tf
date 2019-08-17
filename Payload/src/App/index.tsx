import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { SiteConfiguration, UserViewModel } from '../common/types';
import Home from '../pages/Home';
import Player from '../pages/Player';
import Banned from '../pages/Banned';
import Loading from '../components/Loading';
import HttpClient from '../common/HttpClient';

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
  faGrinAlt,
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
  faGrinAlt,
  faStar,
  faArrowDown
);

interface AppState {
  configuration?: SiteConfiguration;
  user?: UserViewModel;
  disconnected: boolean;
}

class App extends React.Component<{}, AppState> {

  private http: HttpClient;
  private socket: SocketIOClient.Socket;
  private dummyConfiguration: SiteConfiguration;

  constructor(props: Object) {
    super(props);

    this.http = new HttpClient();
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
      this.setState({ configuration });
    });

    this.socket.on('user', (user: UserViewModel) => {
      this.setState({ user });
    });

    this.socket.on('disconnect', () => {
      this.setState({
        disconnected: true
      });
    });

    this.socket.on('reconnect', () => {
      this.setState({
        disconnected: false
      });
    });

    this.state = {
      disconnected: false
    };
  }

  reconnectMessage = () => {
    if (this.state.disconnected) {
      return (
        <Loading
          loadingMessages={[
            {
              message: 'Reconnecting to Server',
              timeout: 0
            },
            {
              message: 'Server may be experiencing issues. Contact site admins for help.',
              timeout: 10
            }
          ]}
        />
      );
    }

    return null;
  }

  render() {
    if (this.state.configuration && this.state.user) {
      return (
        <>
          {this.reconnectMessage()}
          <Router>
            <Switch>
              <Route
                exact={true}
                path="/"
                render={() =>
                  <Home
                    http={this.http}
                    socket={this.socket}
                    configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
                    user={this.state.user ? this.state.user : {}}
                  />
                }
              />
              <Route
                path="/player/:steamid"
                render={routeProps =>
                  <Player
                    http={this.http}
                    socket={this.socket}
                    configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
                    user={this.state.user ? this.state.user : {}}
                    {...routeProps}
                  />
                }
              />
              <Route
                exact={true}
                path="/banned"
                render={() =>
                  <Banned
                    http={this.http}
                    socket={this.socket}
                    configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
                  />
                }
              />
              <Redirect from="*" to="/" />
            </Switch>
          </Router>
        </>
      );
    }

    return (
      <Loading
        loadingMessages={[
          {
            message: 'Connecting to Server',
            timeout: 0
          },
          {
            message: 'Server may be experiencing issues. Contact site admins for help.',
            timeout: 10
          }
        ]}
      />
    );
  }
}

export default App;
