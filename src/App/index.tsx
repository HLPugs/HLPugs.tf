import * as React from 'react';
import * as io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { SiteConfiguration, UserScheme } from '../common/types';
import Home from '../pages/Home';
import './style.css';

import fontawesome from '@fortawesome/fontawesome';
import * as faSteamSymbol from '@fortawesome/fontawesome-free-brands/faSteamSymbol';

fontawesome.library.add(faSteamSymbol);

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
