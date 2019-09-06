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

interface HomeProps {
	socket: SocketIOClient.Socket;
	configuration: SiteConfigurationModel;
	currentPlayer: PlayerViewModel;
}

interface HomeState {
	isSettingsOpen: boolean;
	loggedInPlayers: PlayerViewModel[];
}

const PlayerCtxt = React.createContext<Object | null>(null);

const PlayerDataProvider = PlayerCtxt.Provider;

export const PlayerDataConsumer = PlayerCtxt.Consumer;

const SocketCtxt = React.createContext<SocketIOClient.Socket>(io());

const SocketProvider = SocketCtxt.Provider;

export const SocketConsumer = SocketCtxt.Consumer;

class Home extends React.Component<HomeProps, HomeState> {
	constructor(props: HomeProps) {
		super(props);

		this.state = {
			isSettingsOpen: false,
			loggedInPlayers: []
		};

		this.props.socket.on('getLoggedInUsers', (loggedInPlayers: PlayerViewModel[]) => {
			this.setState({ loggedInPlayers });
		});

		this.props.socket.on('addPlayerToSession', (player: PlayerViewModel) => {
			this.setState({ loggedInPlayers: [...this.state.loggedInPlayers, player] });
		});

		this.props.socket.on('removePlayerFromSession', (steamid: SteamID) => {
			this.setState({
				loggedInPlayers: this.state.loggedInPlayers.filter(x => x.steamid !== steamid)
			});
		});

		// Tell server that this socket connection is on the homepage
		this.props.socket.emit('playedLoadedHomepage');

		this.props.socket.on('reconnect', () => {
			this.props.socket.emit('playerLoadedHomepage');
		});
	}

	AliasModal = () => {
		if (!this.props.currentPlayer.alias && this.props.currentPlayer.isLoggedIn) {
			return <AliasModal socket={this.props.socket} />;
		}

		return null;
	};

	toggleSettings = () => {
		this.setState({
			isSettingsOpen: !this.state.isSettingsOpen
		});
	};

	render() {
		return (
			<div id="Home">
				<PlayerDataProvider value={this.state.loggedInPlayers}>
					<SocketProvider value={this.props.socket}>
						<Header
							siteName={this.props.configuration.branding.siteName}
							siteSubTitle={this.props.configuration.branding.siteSubTitle}
							logoPath={this.props.configuration.branding.logoPath}
						/>
						<User user={this.props.currentPlayer} settingsOnClick={this.toggleSettings} />
						<Navigation navigationGroup={this.props.configuration.navigation} />
						<DraftArea
							classes={this.props.configuration.gamemodeClassSchemes}
							steamid={this.props.currentPlayer.steamid}
						/>
						<Chat socket={this.props.socket} user={this.props.currentPlayer} />
						<Settings
							settings={this.props.currentPlayer.settings}
							socket={this.props.socket}
							visibility={this.state.isSettingsOpen}
							classes={this.props.configuration.gamemodeClassSchemes}
							settingsOnClick={this.toggleSettings}
							userAlias={this.props.currentPlayer.alias}
						/>
						{this.AliasModal()}
					</SocketProvider>
				</PlayerDataProvider>
			</div>
		);
	}
}

export default Home;
