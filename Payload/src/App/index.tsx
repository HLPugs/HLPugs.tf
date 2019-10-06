import React from 'react';
import io from 'socket.io-client';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { SiteConfigurationModel } from '../../../Common/Models/SiteConfigurationModel';
import Home from '../pages/Home';
import Player from '../pages/Player';
import Banned from '../pages/Banned';
import Admin from '../pages/Admin';
import Loading from '../components/Loading';
import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSteamSymbol, faDiscord, faPatreon } from '@fortawesome/free-brands-svg-icons';
import {
	faUser,
	faCog,
	faSignOutAlt,
	faTachometerAlt,
	faGavel,
	faUserSecret,
	faGamepad,
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
	faChartPie,
	faPlus,
	faGripVertical
} from '@fortawesome/free-solid-svg-icons';
import PlayerViewModel from '../../../Common/ViewModels/PlayerViewModel';
import Region from '../../../Common/Enums/Region';
import Gamemode from '../../../Common/Enums/Gamemode';
import MatchType from '../../../Common/Enums/MatchType';
import PermissionGroup from '../../../Common/Enums/PermissionGroup';

library.add(
	faSteamSymbol,
	faDiscord,
	faUser,
	faCog,
	faSignOutAlt,
	faTachometerAlt,
	faGavel,
	faUserSecret,
	faGamepad,
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
	faChartPie,
	faPlus,
	faGripVertical
);

interface AppState {
	configuration?: SiteConfigurationModel;
	currentPlayer: PlayerViewModel;
	disconnected: boolean;
	isBanned: boolean;
}

class App extends React.Component<{}, AppState> {
	private socket: SocketIOClient.Socket;
	private dummyConfiguration: SiteConfigurationModel;

	constructor(props: Record<string, any>) {
		super(props);

		this.socket = io(`${window.location.protocol}//${window.location.hostname}:3001`);

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

		this.socket.on('updateCurrentPlayer', (currentPlayer: PlayerViewModel) => {
			this.setState({ currentPlayer });
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

		this.socket.on('playerIsBanned', () => {
			this.setState({ isBanned: true });
		});

		this.state = {
			currentPlayer: new PlayerViewModel(),
			disconnected: false,
			isBanned: false
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
	};

	redirectIfBanned = () => {
		if (this.state.isBanned) {
			return (
				<>
					<Route
						exact={true}
						path="/banned"
						render={() => (
							<Banned
								socket={this.socket}
								configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
								steamid={this.state.currentPlayer.steamid}
							/>
						)}
					/>
					<Redirect from="*" to="/banned" />
				</>
			);
		}

		return null;
	};

	render() {
		if (this.state.configuration) {
			return (
				<DndProvider backend={HTML5Backend}>
					{this.reconnectMessage()}
					<Router>
						<Switch>
							{this.redirectIfBanned()}
							<Route
								exact={true}
								path="/"
								render={() => (
									<Home
										socket={this.socket}
										configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
										currentPlayer={this.state.currentPlayer}
									/>
								)}
							/>
							<Route
								path="/player/:steamid"
								render={routeProps => (
									<Player
										socket={this.socket}
										configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
										currentPlayer={this.state.currentPlayer}
										{...routeProps}
									/>
								)}
							/>
							<Route
								path="/admin"
								render={() =>
									this.state.currentPlayer.alias &&
									this.state.currentPlayer.permissionGroup !== PermissionGroup.NONE ? (
										<Admin
											socket={this.socket}
											configuration={this.state.configuration ? this.state.configuration : this.dummyConfiguration}
											currentPlayer={this.state.currentPlayer}
										/>
									) : (
										<Redirect to="/" />
									)
								}
							/>
							<Redirect from="*" to="/" />
						</Switch>
					</Router>
				</DndProvider>
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
