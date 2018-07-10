import * as React from 'react';
import * as io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { SiteConfiguration, UserScheme } from '../common/types';
import Home from '../pages/Home';
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
  faTimes
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
  faTimes
);

interface AppState {
  configuration: SiteConfiguration;
  user: UserScheme;
}

class App extends React.Component<{}, AppState> {
  
  private socket: SocketIOClient.Socket;
  
  constructor(props: Object) {
    super(props);
    
    this.socket = io(window.location.hostname + ':3001');
    
    this.state = {
      configuration: {
        branding: {
          siteName: 'HLPugs.tf',
          siteSubTitle: 'PUG NA HL',
          logoPath: 'logo.svg'
        },
        navigation: [
          {
            type: 'tab',
            tabConfig: {
              icon: 'gavel',
              iconPrefix: 'fas',
              name: 'Rules',
              link: '/rules',
              external: false
            }
          },
          {
            type: 'tab',
            tabConfig: {
              icon: 'tachometer-alt',
              iconPrefix: 'fas',
              name: 'Overview',
              link: '/overview',
              external: false
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'tab',
            tabConfig: {
              icon: 'microphone',
              iconPrefix: 'fas',
              name: 'Mumble',
              link: 'mumble://hlpugs.tf',
              external: true
            }
          },
          {
            type: 'tab',
            tabConfig: {
              icon: 'discord',
              iconPrefix: 'fab',
              name: 'Discord',
              link: 'https://discord.gg/rwXy3rq',
              external: true
            }
          },
          {
            type: 'tab',
            tabConfig: {
              icon: 'patreon',
              iconPrefix: 'fab',
              name: 'Patreon',
              link: 'https://patreon.com/hlpugs',
              external: true
            }
          },
          {
            type: 'divider'
          },
          {
            type: 'module',
            moduleConfig: {
              name: 'Captain',
              moduleName: 'Captain'
            }
          },
          {
            type: 'module',
            moduleConfig: {
              name: 'Pre-Ready',
              moduleName: 'PreReady'
            }
          }
        ],
        classes: [
          {
            name: 'Scout',
            numberPerTeam: 1
          },
          {
            name: 'Demo',
            numberPerTeam: 1
          },
          {
            name: 'Medic',
            numberPerTeam: 1
          },
          {
            name: 'Sniper',
            numberPerTeam: 1
          },
          {
            name: 'Flex',
            numberPerTeam: 3
          }
        ]
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
