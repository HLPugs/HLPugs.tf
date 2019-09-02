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
import { SiteConfiguration } from '../../common/types';
import UserViewModel from '../../../../Common/ViewModels/UserViewModel';

interface HomeProps {
	socket: SocketIOClient.Socket;
	configuration: SiteConfiguration;
	user: UserViewModel;
}

interface HomeState {
	settingsOpen: boolean;
	playerData: any;
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
			settingsOpen: false,
			playerData: {}
		};

		this.props.socket.on('playerData', (playerData: Array<UserViewModel>) => {
			let newPlayerData = { ...this.state.playerData };

			for (const player of playerData) {
				if (player && player.steamid) {
					newPlayerData[player.steamid] = player;
				}
			}

			this.setState({
				playerData: newPlayerData
			});
		});

		this.props.socket.on('addPlayerToData', (player: UserViewModel) => {
			let newPlayerData = { ...this.state.playerData };

			if (player.steamid) {
				newPlayerData[player.steamid] = player;
			}

			this.setState({
				playerData: newPlayerData
			});
		});

		this.props.socket.on('removePlayerFromData', (playerId: string) => {
			let newPlayerData = { ...this.state.playerData };

			delete newPlayerData[playerId];

			this.setState({
				playerData: newPlayerData
			});
		});

		// Tell server that this socket connection is on the homepage
		this.props.socket.emit('home');

		this.props.socket.on('reconnect', () => {
			this.props.socket.emit('home');
		});
	}

	AliasModal = () => {
		if (!this.props.user.alias && this.props.user.loggedIn) {
			return <AliasModal socket={this.props.socket} />;
		}

		return null;
	};

	toggleSettings = () => {
		this.setState({
			settingsOpen: !this.state.settingsOpen
		});
	};

	render() {
		return (
			<div id="Home">
				<PlayerDataProvider value={this.state.playerData}>
					<SocketProvider value={this.props.socket}>
						<Header
							siteName={this.props.configuration.branding.siteName}
							siteSubTitle={this.props.configuration.branding.siteSubTitle}
							logoPath={this.props.configuration.branding.logoPath}
						/>
						<User
							user={this.props.user}
							settingsOnClick={this.toggleSettings}
						/>
						<Navigation navigationGroup={this.props.configuration.navigation} />
						<DraftArea
							classes={this.props.configuration.classes}
							steamid={this.props.user.steamid}
						/>
						<Chat socket={this.props.socket} user={this.props.user} />
						<Settings
							settings={this.props.user.settings}
							socket={this.props.socket}
							visibility={this.state.settingsOpen}
							classes={this.props.configuration.classes}
							settingsOnClick={this.toggleSettings}
							userAlias={this.props.user.alias}
						/>
						{this.AliasModal()}
					</SocketProvider>
				</PlayerDataProvider>
			</div>
		);
	}
}

export default Home;
