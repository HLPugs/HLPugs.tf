import React from 'react';
import io from 'socket.io-client';
import Header from '../../components/Header';
import User from '../../components/User';
import Navigation from '../../components/Navigation';
import DraftArea from '../../components/DraftArea';
import Chat from '../../components/Chat';
import AliasModal from '../../components/AliasModal';
import Settings from '../../components/Settings';
import './style.scss';
import PlayerViewModel from '../../../../Common/ViewModels/PlayerViewModel';
import { SiteConfigurationModel } from '../../../../Common/Models/SiteConfigurationModel';
import SteamID from '../../../../Common/Types/SteamID';
import Debug from '../../components/Debug';

interface HomeProps {
	socket: SocketIOClient.Socket;
	configuration: SiteConfigurationModel;
	currentPlayer: PlayerViewModel;
}

interface HomeState {
	showAliasModal: boolean;
	isSettingsOpen: boolean;
	loggedInPlayers: PlayerViewModel[];
}

const PlayerCtxt = React.createContext<PlayerViewModel[]>([]);

const LoggedInPlayersProvider = PlayerCtxt.Provider;

export const LoggedInPlayersConsumer = PlayerCtxt.Consumer;

const SocketCtxt = React.createContext<SocketIOClient.Socket>(io());

const SocketProvider = SocketCtxt.Provider;

export const SocketConsumer = SocketCtxt.Consumer;

class Home extends React.Component<HomeProps, HomeState> {
	constructor(props: HomeProps) {
		super(props);

		this.state = {
			showAliasModal: false,
			isSettingsOpen: false,
			loggedInPlayers: []
		};

		this.componentDidUpdate = () => {
			this.props.socket.emit('playerLoadedHomepage');
		};

		this.props.socket.on('getLoggedInPlayers', (loggedInPlayers: PlayerViewModel[]) => {
			this.setState({ loggedInPlayers });
		});

		this.props.socket.on('updatePlayerGlobally', (updatedPlayer: PlayerViewModel) => {
			const indexOfPlayer = this.state.loggedInPlayers.findIndex(player => player.steamid === updatedPlayer.steamid);
			const newLoggedInPlayers = this.state.loggedInPlayers;
			newLoggedInPlayers[indexOfPlayer] = updatedPlayer;

			this.setState({
				loggedInPlayers: newLoggedInPlayers
			});
		});

		this.props.socket.on('addPlayerToSession', (player: PlayerViewModel) => {
			this.setState({ loggedInPlayers: [...this.state.loggedInPlayers, player] });
		});

		this.props.socket.on('removePlayerFromSession', (steamid: SteamID) => {
			this.setState({
				loggedInPlayers: this.state.loggedInPlayers.filter(x => x.steamid !== steamid)
			});
		});

		this.props.socket.on('reconnect', () => {
			this.props.socket.emit('playerLoadedHomepage');
		});

		this.props.socket.on('showAliasModal', () => {
			this.setState({ showAliasModal: true });
		});
	}

	AliasModal = () => {
		if (this.state.showAliasModal && !this.props.currentPlayer.steamid) {
			return <AliasModal socket={this.props.socket} />;
		}

		return null;
	};

	Settings = () => {
		if (this.props.currentPlayer) {
			return (
				<Settings
					settings={this.props.currentPlayer.settings}
					socket={this.props.socket}
					visibility={this.state.isSettingsOpen}
					classes={this.props.configuration.gamemodeClassSchemes}
					settingsOnClick={this.toggleSettings}
					userAlias={this.props.currentPlayer.alias}
				/>
			);
		} else {
			return null;
		}
	};
	toggleSettings = () => {
		this.setState({
			isSettingsOpen: !this.state.isSettingsOpen
		});
	};

	render() {
		return (
			<div id="Home">
				<LoggedInPlayersProvider value={this.state.loggedInPlayers}>
					<SocketProvider value={this.props.socket}>
						<Header
							siteName={this.props.configuration.branding.siteName}
							siteSubTitle={this.props.configuration.branding.siteSubTitle}
							logoPath={this.props.configuration.branding.logoPath}
						/>
						<User currentPlayer={this.props.currentPlayer} settingsOnClick={this.toggleSettings} />
						<Navigation navigationGroup={this.props.configuration.navigation} />
						<DraftArea
							classes={this.props.configuration.gamemodeClassSchemes}
							steamid={this.props.currentPlayer.steamid}
						/>
						<Chat socket={this.props.socket} currentPlayer={this.props.currentPlayer} />

						<Debug socket={this.props.socket} classes={this.props.configuration.gamemodeClassSchemes} />
						{this.Settings()}
						{this.AliasModal()}
					</SocketProvider>
				</LoggedInPlayersProvider>
			</div>
		);
	}
}

export default Home;
