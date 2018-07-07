import * as React from 'react';
import * as io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { SiteConfiguration, UserScheme } from '../common/types';
import Home from '../pages/Home';
import './style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSteamSymbol } from '@fortawesome/free-brands-svg-icons';
import { faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

library.add(faSteamSymbol, faUser, faCog, faSignOutAlt);

interface AppState {
  configuration: SiteConfiguration;
  user: UserScheme;
}

class App extends React.Component<{}, AppState> {
  
  private socket: SocketIOClient.Socket;
  
  constructor(props: Object) {
    super(props);
    
    this.socket = io();
    
    this.state = {
      configuration: {
        branding: {
          siteName: 'HLPugs.tf',
          siteSubTitle: 'PUG NA HL',
          logoPath: 'logo.svg'
        },
        navigation: [],
        classes: []
      },
      user: {
        loggedIn: true,
        alias: 'Nicell',
        avatar: 'test',
        steamid: '7'
      }
    };
  }
  
  render() {
    return (
      <Router>
        <Switch>
          <Route 
            exact={true} 
            path="/" 
            render={() => 
              <Home 
                socket={this.socket} 
                configuration={this.state.configuration} 
                user={this.state.user} 
              />
            } 
          />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
