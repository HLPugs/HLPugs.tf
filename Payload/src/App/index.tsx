import React from 'react';
import io from 'socket.io-client';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import { SiteConfigurationModel } from '../../../Common/Models/SiteConfigurationModel';
import Home from '../pages/Home';
import Player from '../pages/Player';
import Banned from '../pages/Banned';
import Loading from '../components/Loading';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faSteamSymbol,
	faDiscord,
	faPatreon
} from '@fortawesome/free-brands-svg-icons';
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
	faArrowDown,
	faArrowLeft,
	faArrowRight,
	faChartPie
} from '@fortawesome/free-solid-svg-icons';
import UserViewModel from '../../../Common/ViewModels/UserViewModel';
import Region from '../../../Common/Enums/Region';
import Gamemode from '../../../Common/Enums/Gamemode';
import MatchType from '../../../Common/Enums/MatchType';

library.add(
	faSteamSymbol,
	faDiscord,
	faUser,
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
	faArrowDown,
	faArrowLeft,
	faArrowRight,
	faChartPie
);

interface AppState {
	configuration?: SiteConfigurationModel;
	user?: UserViewModel;
	disconnected: boolean;
}

class App extends React.Component<{}, AppState> {
	private socket: SocketIOClient.Socket;
	private dummyConfiguration: SiteConfigurationModel;

	constructor(props: Record<string, any>) {
		super(props);

		this.socket = io(
			`${window.location.protocol}//${window.location.hostname}:3001`
		);

		this.dummyConfiguration = {
			branding: {
				siteName: '',
				siteSubTitle: '',
				logoPath: ''
			},
			navigation: [],
			gamemodeClassSchemes: [],
			environmentConfig: {
				region: Region.NorthAmerica,
				gamemode: Gamemode.Highlander,
				matchType: MatchType.PUG
			}
		};

		this.socket.on('siteConfiguration', (configuration: SiteConfigurationModel) => {
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
							message:
								'Server may be experiencing issues. Contact site admins for help.',
							timeout: 10
						}
					]}
				/>
			);
		}

		return null;
	};

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
								render={() => (
									<Home
										socket={this.socket}
										configuration={
											this.state.configuration
												? this.state.configuration
												: this.dummyConfiguration
										}
										user={this.state.user ? this.state.user : new UserViewModel()}
									/>
								)}
							/>
							<Route
								path="/player/:steamid"
								render={routeProps => (
									<Player
										socket={this.socket}
										configuration={
											this.state.configuration
												? this.state.configuration
												: this.dummyConfiguration
										}
										user={this.state.user ? this.state.user : new UserViewModel()}
										{...routeProps}
									/>
								)}
							/>
							<Route
								exact={true}
								path="/banned"
								render={() => (
									<Banned
										socket={this.socket}
										configuration={
											this.state.configuration
												? this.state.configuration
												: this.dummyConfiguration
										}
									/>
								)}
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
						message:
							'Server may be experiencing issues. Contact site admins for help.',
						timeout: 10
					}
				]}
			/>
		);
	}
}

export default App;
